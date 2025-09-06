import { io, Socket } from 'socket.io-client';
import { Recognition } from './api.prod';

class SocketService {
  private socket: Socket | null = null;
  private callbacks: ((recognition: Recognition) => void)[] = [];

  connect() {
    const socketUrl = window.location.origin; // Use same origin for Vercel deployment
      
    this.socket = io(socketUrl);
    
    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
    });

    this.socket.on('NEW_RECOGNITION', (data: any) => {
      console.log('📨 New recognition received:', data);
      this.callbacks.forEach(callback => callback(data));
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewRecognition(callback: (recognition: Recognition) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
}

export const socketService = new SocketService();
