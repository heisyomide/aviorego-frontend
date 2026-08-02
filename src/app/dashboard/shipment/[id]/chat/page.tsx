'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
import { getSocket } from '../../../../communication/socket/socket';
import { useCall } from '../../../../communication/call/useCall';
import { ShipmentService } from '../../services/shipments.service';

interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'RIDER' | 'ADMIN';
  text: string;
  timestamp: string;
}

const QUICK_PRESETS = [
  "I'm at the main entrance.",
  "Please leave the package at the door.",
  "What is your current ETA?",
  "I will come down to meet you.",
  "Thank you!",
];

const getAuthToken = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('aviore_token') || 
         localStorage.getItem('token') || 
         localStorage.getItem('accessToken') || '';
};

export default function CustomerChatPage() {
  const router = useRouter();
  const params = useParams();
 const jobId = (params?.id as string) || '';

  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const [riderUserId, setRiderUserId] = useState<string>('');
  const [riderName, setRiderName] = useState<string>('Assigned Rider');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('userId') || '';
      setCurrentUserId(uid);
      console.log('[AVIORÈ DEBUG] Current User ID loaded:', uid);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadShipmentAndConnect() {
      if (!jobId) {
        console.warn('[AVIORÈ DEBUG] No jobId found in params!');
        return;
      }

      try {
        setIsLoading(true);
        const token = getAuthToken();
        console.log('[AVIORÈ DEBUG] 1. Token present:', !!token);
        console.log('[AVIORÈ DEBUG] 2. Fetching shipment for ID:', jobId);

        // FIX: Pass only 1 argument (jobId) to match your service client
       const shipmentData: any = await ShipmentService.getShipment(jobId, token);
        console.log('[AVIORÈ DEBUG] 3. Shipment Data Fetched Successfully:', shipmentData);
        
        const resolvedRiderId = shipmentData?.rider?.id || shipmentData?.riderId || '';
        const resolvedRiderName = shipmentData?.rider?.name || shipmentData?.riderName || 'Assigned Rider';
        
        console.log('[AVIORÈ DEBUG] 4. Resolved Rider ID:', resolvedRiderId, '| Name:', resolvedRiderName);

        if (!isMounted) return;
        setRiderUserId(resolvedRiderId);
        setRiderName(resolvedRiderName);

        // Initialize Socket
        console.log('[AVIORÈ DEBUG] 5. Initializing Socket connection...');
        const socket = getSocket(token);
        socketRef.current = socket;

        // Force connection properties if supported
        if (socket.auth) {
          socket.auth = { token };
        }
        if (!socket.connected) {
          socket.connect();
        }

        const onConnect = () => {
          console.log('[AVIORÈ DEBUG] 🟢 SOCKET CONNECTED! Socket ID:', socket.id);
          if (isMounted) setIsConnected(true);
          console.log('[AVIORÈ DEBUG] 📦 Emitting join_job_room with jobId:', jobId);
          socket.emit('join_job_room', { jobId });
        };

        const onConnectError = (err: any) => {
          console.error('[AVIORÈ DEBUG] 🔴 SOCKET CONNECTION ERROR (Backend rejected handshake):', err?.message || err);
        };

        const onDisconnect = (reason: string) => {
          console.warn('[AVIORÈ DEBUG] 🟡 SOCKET DISCONNECTED. Reason:', reason);
          if (isMounted) setIsConnected(false);
        };

        const onChatHistory = (history: ChatMessage[]) => {
          console.log('[AVIORÈ DEBUG] 📥 CHAT HISTORY RECEIVED:', history);
          if (isMounted) setMessages(history);
        };

        const onReceiveMessage = (msg: ChatMessage) => {
          console.log('[AVIORÈ DEBUG] 💬 LIVE MESSAGE RECEIVED:', msg);
          if (isMounted) {
            setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          }
        };

        // Clear and bind
        socket.off('connect', onConnect);
        socket.off('connect_error', onConnectError);
        socket.off('disconnect', onDisconnect);
        socket.off('chat_history', onChatHistory);
        socket.off('receive_message', onReceiveMessage);

        socket.on('connect', onConnect);
        socket.on('connect_error', onConnectError);
        socket.on('disconnect', onDisconnect);
        socket.on('chat_history', onChatHistory);
        socket.on('receive_message', onReceiveMessage);

        if (socket.connected) {
          onConnect();
        }
      } catch (err: any) {
        console.error('[AVIORÈ DEBUG] ❌ FATAL ERROR IN CHAT SETUP:', err);
        if (isMounted) setError(err?.message || 'Unable to load delivery connection.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadShipmentAndConnect();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('disconnect');
        socketRef.current.off('chat_history');
        socketRef.current.off('receive_message');
      }
    };
  }, [jobId]);

  const callHandlers = useCall({
    socket: socketRef.current,
    jobId,
    currentUserId,
  });

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !socketRef.current) {
      console.warn('[AVIORÈ DEBUG] Cannot send message: text is empty or socket is missing.');
      return;
    }

    console.log('[AVIORÈ DEBUG] 📤 Emitting send_message:', { jobId, text: text.trim() });
    socketRef.current.emit('send_message', { jobId, text: text.trim() });
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
        <p className="text-xs font-semibold">Connecting to secure channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-800">Connection Error</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">{error}</p>
        <Link href={`/orders/${jobId}`} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
          Back to Order
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <audio ref={callHandlers.remoteAudioRef} autoPlay playsInline />

      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <Link href={`/orders/${jobId}`} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{riderName}</h2>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Order #{jobId.slice(0, 8)}</span>
                <span>•</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>Encrypted Connection</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => callHandlers.callUser(riderUserId, riderName)}
          disabled={!isConnected || callHandlers.isCalling || callHandlers.isCallConnected || !riderUserId}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
        >
          <Phone className="w-4 h-4" /> Call Rider
        </button>
      </header>

      {(callHandlers.isCalling || callHandlers.isReceivingCall || callHandlers.isCallConnected) && (
        <div className="bg-emerald-900 text-white p-4 shadow-md flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-xs font-semibold">
                {callHandlers.isCalling && `Calling ${riderName}...`}
                {callHandlers.isReceivingCall && `Incoming audio call from ${callHandlers.callerName}`}
                {callHandlers.isCallConnected && `Active Voice Call (${formatTimer(callHandlers.callDuration)})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {callHandlers.isReceivingCall ? (
              <>
                <button onClick={callHandlers.answerCall} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Answer
                </button>
                <button onClick={callHandlers.endCall} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                  <PhoneOff className="w-3.5 h-3.5" /> Decline
                </button>
              </>
            ) : (
              <>
                {callHandlers.isCallConnected && (
                  <button onClick={callHandlers.toggleMute} className={`p-2 rounded-lg text-xs font-semibold ${callHandlers.isMuted ? 'bg-amber-500' : 'bg-emerald-800'}`}>
                    {callHandlers.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button onClick={callHandlers.endCall} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                  <PhoneOff className="w-3.5 h-3.5" /> End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
            <Sparkles className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Direct Rider Communication</p>
            <p className="text-xs max-w-xs text-slate-500">Coordinate delivery details securely with your assigned rider.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId || msg.senderRole === 'CUSTOMER';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-xs max-w-[75%] shadow-xs ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                    <Clock className="w-2.5 h-2.5" />
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-200 ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </main>

      <div className="px-4 py-2 bg-slate-100/60 border-t border-slate-200 flex items-center gap-2 overflow-x-auto fixed bottom-16 left-0 right-0 z-20">
        {QUICK_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(preset)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 shrink-0 shadow-xs"
          >
            {preset}
          </button>
        ))}
      </div>

      <footer className="p-3 bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-20">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message to your rider..."
            disabled={!isConnected}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-2xl outline-none focus:border-emerald-500"
          />
          <button type="submit" disabled={!inputMessage.trim() || !isConnected} className="p-3 bg-emerald-600 disabled:bg-slate-200 text-white rounded-2xl shadow-xs">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}