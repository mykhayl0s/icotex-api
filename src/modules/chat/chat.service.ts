import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage({ room, content, user }): Promise<Message> {
    const createdMessage = new this.messageModel({
      room,
      user,
      content,
    });
    return createdMessage.save();
  }

  async getMessages(userId: string): Promise<Message[]> {
    return this.messageModel
      .find({ participants: { $in: [userId, new Types.ObjectId(userId)] } })
      .exec();
  }
}
