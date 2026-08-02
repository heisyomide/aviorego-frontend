'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { 
  ArrowLeft, Send, Phone, PhoneOff, Mic, MicOff, ShieldCheck, User, 
  CheckCheck, Clock, Sparkles, PhoneCall, Loader2, AlertCircle
} from 'lucide-react';

import type { ShipmentDetails } from '../types';
import shipmentService from '../services/shipment.service';

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
    }
  ],
};

const RIDER_QUICK_PRESETS = [
  "I've arrived at the pickup location.",
  "I'm at the delivery address.",
  "I am running about 5 mins late due to traffic.",
  "Please share your verification PIN.",
];

export default function RiderJobLiveChatPage() {
  const router = useRouter();
  const params = useParams();
  
  const jobId = (params?.shipmentId as string) || (params?.id as string) || (params?.jobId as string) || '';

  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [loadingShipment, setLoadingShipment] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const [callState, setCallState] = useState<CallState>({
    isCalling: false,
    isReceivingCall: false,
    isCallConnected: false,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localAudioStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const targetUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) setCurrentUserId(storedId);
    }
  }, []);

  // Fetch Shipment Details
  useEffect(() => {
    async function fetchDetails() {
      if (!jobId) return;
      try {
        setLoadingShipment(true);
        const response: any = await shipmentService.getShipment(jobId);
        const shipmentData = response?.shipment || response?.data || response;
        setShipment(shipmentData);
      } catch (err: any) {
        console.error('Failed to load shipment details:', err);
        setError(err?.message || 'Failed to load order communication session.');
      } finally {
        setLoadingShipment(false);
      }
    }
    fetchDetails();
  }, [jobId]);

  // Derived Customer Details
  const customerName = 
    (shipment as any)?.user?.fullName ||
    (shipment as any)?.user?.name ||
    (shipment as any)?.customer?.fullName ||
    (shipment as any)?.customer?.name ||
    (shipment as any)?.sender?.name ||
    (shipment as any)?.senderName ||
    'Customer';

  const customerUserId = 
    (shipment as any)?.userId || 
    (shipment as any)?.customerId || 
    (shipment as any)?.senderId || 
    (shipment as any)?.user?.id || 
    '';

  const recipientPhone = (shipment as any)?.recipient?.phone || (shipment as any)?.recipientPhone;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        remoteAudioRef.current.play().catch((err) => console.error('Audio playback error:', err));
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        cleanupCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [cleanupCall]);

  // Socket Connection Effect (Removed customerName from deps to prevent re-connect loop)
  useEffect(() => {
    if (!jobId) return;

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const socketInstance = io(`${backendUrl}/job-comm`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: { token },
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('join_job_room', { jobId });
    });

    socketInstance.on('disconnect', (reason) => {
      console.warn('Rider Socket Disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Rider Socket Connection Error:', err.message);
    });

    socketInstance.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socketInstance.on('receive_message', (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socketInstance.on('incoming_call', (data: any) => {
      targetUserIdRef.current = data.callerUserId;
      setCallState({
        isCalling: false,
        isReceivingCall: true,
        isCallConnected: false,
        offer: data.offer,
        targetUserId: data.callerUserId,
        callerName: data.callerName || 'Customer',
      });
    });

    socketInstance.on('call_accepted', async (data: any) => {
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
    });

    socketInstance.on('ice_candidate', async (data: any) => {
      try {
        if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          iceCandidatesQueue.current.push(data.candidate);
        }
      } catch (e) {
        console.error('Error adding remote ICE candidate:', e);
      }
    });

    socketInstance.on('call_ended', () => cleanupCall());

    return () => {
      cleanupCall();
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [jobId, cleanupCall, startCallTimer]);

  const handleStartCall = async () => {
    if (!socketRef.current || !isConnected) {
      alert('Communication server is offline.');
      return;
    }

    if (!customerUserId) {
      alert('Customer information missing. Cannot place call.');
      return;
    }

    try {
      targetUserIdRef.current = customerUserId;
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
        callerName: customerName,
        targetUserId: customerUserId 
      });

      socketRef.current.emit('call_user', {
        jobId,
        recipientUserId: customerUserId,
        offer,
        callerName: 'Rider',
      });
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Microphone permission is required.');
      cleanupCall();
    }
  };

  const handleAnswerCall = async () => {
    if (!socketRef.current || !callState.offer || !callState.targetUserId) return;

    try {
      if (remoteAudioRef.current) remoteAudioRef.current.play().catch(() => {});

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

  if (loadingShipment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
        <p className="text-xs font-semibold">Connecting to delivery channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <h3 className="text-sm font-bold text-neutral-200">Unable to Open Communication</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">{error}</p>
        <Link
          href="/rider/dashboard"
          className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-semibold hover:bg-neutral-700 transition border border-neutral-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white font-sans">
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* HEADER */}
      <header className="bg-neutral-900 border-b border-neutral-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/rider/dashboard/jobs/${jobId}`}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition border border-neutral-700/60"
            aria-label="Back to order details"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-300">
                <User className="w-5 h-5 text-neutral-400" />
              </div>
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-900 ${
                  isConnected ? 'bg-emerald-500' : 'bg-neutral-600'
                }`} 
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white leading-tight">
                  {customerName}
                </h2>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full text-[10px] font-bold">
                  Customer
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                <span>Code: {shipment?.trackingCode || jobId.slice(0, 8)}</span>
                <span>•</span>
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                <span className="text-neutral-400">Direct Rider Channel</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {recipientPhone && (
            <a
              href={`tel:${recipientPhone}`}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 border border-neutral-700"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Call Recipient</span>
            </a>
          )}

          <button
            onClick={handleStartCall}
            disabled={!isConnected || callState.isCalling || callState.isCallConnected}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-2 border border-emerald-500/30"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Customer</span>
          </button>
        </div>
      </header>

      {/* CALL OVERLAY */}
      {(callState.isCalling || callState.isReceivingCall || callState.isCallConnected) && (
        <div className="bg-emerald-950 text-white p-4 shadow-xl flex items-center justify-between border-b border-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-xs font-semibold">
                {callState.isCalling && `Calling ${customerName}...`}
                {callState.isReceivingCall && `Incoming call from ${callState.callerName || customerName}`}
                {callState.isCallConnected && `Call active (${formatTimer(callDuration)})`}
              </p>
              <p className="text-[11px] text-emerald-300">
                {callState.isCallConnected ? 'Encrypted Audio Active' : 'Connecting audio...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {callState.isReceivingCall ? (
              <>
                <button
                  onClick={handleAnswerCall}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Answer
                </button>
                <button
                  onClick={handleEndCall}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
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
                      isMuted ? 'bg-amber-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={handleEndCall}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <PhoneOff className="w-3.5 h-3.5" /> End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-950">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500 space-y-2">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center shadow-inner text-neutral-400 mb-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-neutral-200">Customer Direct Chat</p>
            <p className="text-xs max-w-xs text-neutral-400">
              Update {customerName} with pickup or drop-off updates directly.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId || msg.senderRole === 'RIDER';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mb-1">
                      C
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none border border-emerald-500/30'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-emerald-200' : 'text-neutral-500'}`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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

      {/* QUICK PRESETS */}
      <div className="px-4 py-2.5 bg-neutral-900/90 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {RIDER_QUICK_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(preset)}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-emerald-950 hover:border-emerald-600/60 border border-neutral-700/80 rounded-full text-xs font-medium text-neutral-300 hover:text-emerald-300 shrink-0 transition"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="p-3 sm:p-4 bg-neutral-900 border-t border-neutral-800/80 shrink-0">
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
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-neutral-950 border border-neutral-800 text-white text-xs p-3 rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition placeholder:text-neutral-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white rounded-2xl transition shadow-md border border-emerald-500/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}