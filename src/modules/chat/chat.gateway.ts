import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
  
  
  @WebSocketGateway()
  export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer() server: Server;
  
    constructor(private chatService: ChatService) {}
  
    afterInit(server: Server) {
      console.log('WebSocket initialized');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { room: string; message: string }) {
      const message = await this.chatService.createMessage(payload.room, payload.message);
      this.server.to(payload.room).emit('receiveMessage', message);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
      client.join(room);
      console.log(`Client ${client.id} joined room ${room}`);
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
      client.leave(room);
      console.log(`Client ${client.id} left room ${room}`);
    }
  
    @SubscribeMessage('getHistory')
    async handleGetHistory(client: Socket, room: string) {
      const messages = await this.chatService.getMessages(room);
      client.emit('history', messages);
    }
  }
  