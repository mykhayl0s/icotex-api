import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './chat.schema';


@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async createMessage(room: string, content: string): Promise<Message> {
    const createdMessage = new this.messageModel({ room, content });
    return createdMessage.save();
  }

  async getMessages(room: string): Promise<Message[]> {
    return this.messageModel.find({ room }).exec();
  }
}
