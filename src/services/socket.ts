import { io, Socket } from 'socket.io-client';
import { Recognition } from './api';

class SocketService {
  private socket: Socket | null = null;
  private callbacks: ((recognition: Recognition) => void)[] = [];

  connect() {
    this.socket = io('http://192.168.1.150:5000');
    
    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
    });

    this.socket.on('new_recognition', (recognition: Recognition) => {
      console.log('🆕 New recognition received:', recognition);
      // Notify all registered callbacks
      this.callbacks.forEach(callback => callback(recognition));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to new recognition events
  onNewRecognition(callback: (recognition: Recognition) => void) {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();
