'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  User, 
  CheckCheck, 
  Clock,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ShipmentService } from '../../services/shipments.service';
import { Shipment } from '../../types';

interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'RIDER' | 'ADMIN';
  text: string;
  timestamp: string;
}

interface CallState {
  isCalling: boolean;
  isReceivingCall: boolean;
  isCallConnected: boolean;
  callerName?: string;
  targetUserId?: string;
  offer?: RTCSessionDescriptionInit;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

const QUICK_PRESETS = [
  "I'm at the main entrance.",
  "Please leave the package at the door.",
  "What is your current ETA?",
  "I will come down to meet you.",
  "Thank you!",
];

// Helper to retrieve auth token safely across multiple storage patterns
const getAuthToken = (): string => {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem('token') || 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('jwt') || 
    ''
  );
};

export default function CustomerJobLiveChatPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.jobId as string) || (params?.shipmentId as string) || '';

  // --- STATE MANAGEMENT ---
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // --- WEBRTC CALL STATE ---
  const [callState, setCallState] = useState<CallState>({
    isCalling: false,
    isReceivingCall: false,
    isCallConnected: false,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // --- REFS ---
  const socketRef = useRef<Socket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localAudioStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const targetUserIdRef = useRef<string | null>(null);

  // Derive target rider details safely
  const shipmentAny = shipment as (Shipment & { 
    riderId?: string; 
    assignedRiderId?: string; 
    rider?: { id?: string; name?: string };
    riderName?: string;
  });

  const riderName = shipmentAny?.rider?.name || shipmentAny?.riderName || 'Rider';
  const riderUserId = shipmentAny?.rider?.id || shipmentAny?.riderId || shipmentAny?.assignedRiderId || '';

  const riderNameRef = useRef(riderName);
  useEffect(() => {
    riderNameRef.current = riderName;
  }, [riderName]);

  // Load User ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setCurrentUserId(storedId);
    }
  }, []);

  // --- FETCH SHIPMENT DETAILS ---
  useEffect(() => {
    async function loadShipment() {
      if (!jobId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const data = await ShipmentService.getShipment(jobId, token);
        setShipment(data);
      } catch (err: any) {
        console.error('Failed to load shipment details:', err);
        setError(err?.message || 'Unable to load delivery details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadShipment();
  }, [jobId]);

  // Auto-scroll chat on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- TIMER & CLEANUP ---
  const startCallTimer = useCallback(() => {
    setCallDuration(0);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const cleanupCall = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getTracks().forEach((track) => track.stop());
      localAudioStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    iceCandidatesQueue.current = [];
    targetUserIdRef.current = null;
    setCallState({ isCalling: false, isReceivingCall: false, isCallConnected: false });
    setIsMuted(false);
    setCallDuration(0);
  }, []);

  // --- WEBRTC CONNECTION CREATION ---
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && targetUserIdRef.current) {
        socketRef.current.emit('ice_candidate', {
          targetUserId: targetUserIdRef.current,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch((err) => console.error('Audio play error:', err));
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(pc.iceConnectionState)) {
        cleanupCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [cleanupCall]);

  // --- SOCKET INITIALIZATION & SIGNALING ---
  useEffect(() => {
    if (!jobId) return;

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
    const token = getAuthToken();

    const socketInstance = io(`${backendUrl}/job-comm`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: { token },
    });

    socketRef.current = socketInstance;

    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
      socketInstance.emit('join_job_room', { jobId });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onException = (err: any) => {
      console.error('WebSocket Exception:', err);
    };

    const onConnectError = (err: any) => {
      console.error('Connection Error:', err.message);
      setConnectionError(`Chat Connection Failed: ${err.message}. Please verify your login session.`);
    };

    const onChatHistory = (history: ChatMessage[]) => {
      setMessages(history);
    };

    const onReceiveMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    const handleIncomingCall = (data: { 
      jobId: string; 
      offer: RTCSessionDescriptionInit; 
      callerUserId: string; 
      callerSocketId: string; 
      callerName: string 
    }) => {
      targetUserIdRef.current = data.callerUserId;
      setCallState({
        isCalling: false,
        isReceivingCall: true,
        isCallConnected: false,
        offer: data.offer,
        targetUserId: data.callerUserId,
        callerName: data.callerName || riderNameRef.current,
      });
    };

    const handleCallAccepted = async (data: { answer: RTCSessionDescriptionInit; responderUserId: string }) => {
      targetUserIdRef.current = data.responderUserId;
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          
          while (iceCandidatesQueue.current.length > 0) {
            const cand = iceCandidatesQueue.current.shift();
            if (cand) await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(cand));
          }

          setCallState((prev) => ({ ...prev, isCalling: false, isCallConnected: true }));
          startCallTimer();
        } catch (err) {
          console.error('Error setting remote description:', err);
          cleanupCall();
        }
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; senderUserId: string }) => {
      try {
        if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          iceCandidatesQueue.current.push(data.candidate);
        }
      } catch (e) {
        console.error('Error adding remote ICE candidate:', e);
      }
    };

    const handleCallEnded = () => cleanupCall();

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('exception', onException);
    socketInstance.on('connect_error', onConnectError);
    socketInstance.on('chat_history', onChatHistory);
    socketInstance.on('receive_message', onReceiveMessage);
    socketInstance.on('incoming_call', handleIncomingCall);
    socketInstance.on('call_accepted', handleCallAccepted);
    socketInstance.on('ice_candidate', handleIceCandidate);
    socketInstance.on('call_ended', handleCallEnded);

    return () => {
      cleanupCall();
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('exception', onException);
      socketInstance.off('connect_error', onConnectError);
      socketInstance.off('chat_history', onChatHistory);
      socketInstance.off('receive_message', onReceiveMessage);
      socketInstance.off('incoming_call', handleIncomingCall);
      socketInstance.off('call_accepted', handleCallAccepted);
      socketInstance.off('ice_candidate', handleIceCandidate);
      socketInstance.off('call_ended', handleCallEnded);
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [jobId, cleanupCall, startCallTimer]);

  // --- CALL ACTIONS ---
  const handleStartCall = async () => {
    if (!socketRef.current || !isConnected || !riderUserId) {
      alert('Unable to initiate call. Communication server offline or rider unavailable.');
      return;
    }

    try {
      targetUserIdRef.current = riderUserId;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localAudioStreamRef.current = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setCallState({ 
        isCalling: true, 
        isReceivingCall: false, 
        isCallConnected: false, 
        callerName: riderName,
        targetUserId: riderUserId
      });

      socketRef.current.emit('call_user', {
        jobId,
        recipientUserId: riderUserId,
        offer,
        callerName: 'Customer',
      });
    } catch (err) {
      console.error('Microphone permission error:', err);
      alert('Microphone access is required to call your rider.');
      cleanupCall();
    }
  };

  const handleAnswerCall = async () => {
    if (!socketRef.current || !callState.offer || !callState.targetUserId) return;

    try {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.play().catch(() => {});
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localAudioStreamRef.current = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(callState.offer));

      while (iceCandidatesQueue.current.length > 0) {
        const cand = iceCandidatesQueue.current.shift();
        if (cand) await pc.addIceCandidate(new RTCIceCandidate(cand));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current.emit('answer_call', {
        targetUserId: callState.targetUserId,
        answer,
      });

      setCallState((prev) => ({ ...prev, isReceivingCall: false, isCallConnected: true }));
      startCallTimer();
    } catch (err) {
      console.error('Error answering call:', err);
      cleanupCall();
    }
  };

  const handleEndCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('end_call', { 
        targetUserId: callState.targetUserId || targetUserIdRef.current || undefined,
        jobId 
      });
    }
    cleanupCall();
  };

  const toggleMute = () => {
    if (localAudioStreamRef.current) {
      const audioTrack = localAudioStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // --- MESSAGE ACTIONS ---
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      jobId,
      text: text.trim(),
    });

    setInputMessage('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-xs font-semibold">Connecting to delivery channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-800">Unable to Open Communication</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">{error}</p>
        <Link
          href="/dashboard"
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/orders/${jobId}`}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition border border-slate-200"
            aria-label="Back to order details"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isConnected ? 'bg-emerald-500' : 'bg-slate-300'
                }`} 
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  {riderName}
                </h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[10px] font-bold">
                  Assigned Rider
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <span>Order #{jobId.slice(0, 8)}</span>
                <span>•</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>Encrypted Connection</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartCall}
          disabled={!isConnected || callState.isCalling || callState.isCallConnected}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Call Rider</span>
        </button>
      </header>

      {/* --- CONNECTION ERROR BANNER --- */}
      {connectionError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-rose-700 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{connectionError}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="underline font-semibold hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* --- IN-CALL OVERLAY BANNER --- */}
      {(callState.isCalling || callState.isReceivingCall || callState.isCallConnected) && (
        <div className="bg-emerald-900 text-white p-4 shadow-md flex items-center justify-between border-b border-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-xs font-semibold">
                {callState.isCalling && `Calling ${riderName}...`}
                {callState.isReceivingCall && `Incoming audio call from ${callState.callerName || 'Rider'}`}
                {callState.isCallConnected && `Active Voice Call (${formatTimer(callDuration)})`}
              </p>
              <p className="text-[11px] text-emerald-200">
                {callState.isCallConnected ? 'Encrypted Audio Active' : 'Establishing P2P stream...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {callState.isReceivingCall ? (
              <>
                <button
                  onClick={handleAnswerCall}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Answer
                </button>
                <button
                  onClick={handleEndCall}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <PhoneOff className="w-3.5 h-3.5" /> Decline
                </button>
              </>
            ) : (
              <>
                {callState.isCallConnected && (
                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg text-xs font-semibold transition ${
                      isMuted ? 'bg-amber-500 text-white' : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={handleEndCall}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <PhoneOff className="w-3.5 h-3.5" /> End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- CHAT MESSAGES BODY --- */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-xs text-slate-400 mb-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Direct Rider Communication</p>
            <p className="text-xs max-w-xs text-slate-500">
              Coordinate delivery locations, gate pass codes, or drop-off preferences directly with {riderName}.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId || msg.senderRole === 'CUSTOMER';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 mb-1">
                      {msg.senderRole ? msg.senderRole.slice(0, 1) : 'R'}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMe ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-200 ml-0.5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </main>

      {/* --- QUICK PRESET CHIPS --- */}
      <div className="px-4 py-2 bg-slate-100/60 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {QUICK_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(preset)}
            className="px-3 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 shrink-0 transition shadow-xs"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* --- CHAT INPUT FOOTER --- */}
      <footer className="p-3 sm:p-4 bg-white border-t border-slate-200/80 shrink-0 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type a message to your rider..." : "Connecting to chat..."}
            disabled={!isConnected}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl transition shadow-xs"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}