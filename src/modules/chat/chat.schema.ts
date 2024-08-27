import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: true } })
export class Message {
  @Prop({ required: true, type: String })
  user: string;

  @Prop({ required: true, type: String })
  room: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false, default: false, type: Boolean})
  isNew: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
