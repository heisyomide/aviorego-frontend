import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket || !socket.connected) {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Strip trailing slashes AND any '/api' suffix so namespace connects at root level
    const baseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

    socket = io(`${baseUrl}/job-comm`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: { token },
    });
  } else {
    // Update token if it changes on re-auth
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};