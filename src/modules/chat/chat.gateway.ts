import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { AuthUserPayload } from 'src/common/roles.guard';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private clientUserMap: Map<string, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const user = this.getTokenFromHeaders(client);
      this.clientUserMap.set(client.id, user._id);
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.clientUserMap.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { userTo: string; message: string },
  ) {
    const user = this.clientUserMap.get(client.id);

    const message = await this.chatService.createMessage(
      [user, payload.userTo],
      payload.message,
    );

    const recipientClientId = Array.from(this.clientUserMap.entries()).find(
      ([clientId, userId]) => userId === payload.userTo,
    )?.[0];

    if (recipientClientId) {
      this.server.to(recipientClientId).emit('receiveMessage', message);
    }
    // this.server.to(payload.room).emit('receiveMessage', message);
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

  private getTokenFromHeaders(client: Socket) {
    const token = client.handshake.headers['authorization'];

    if (!token) {
      throw new WsException('Token not found');
    }

    return jwt.verify(token, 'secretKey') as AuthUserPayload;
  }
}
