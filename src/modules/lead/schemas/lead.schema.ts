import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ versionKey: false, timestamps: true })
export class Lead {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  country: string;

  @Prop({
    required: true,
  })
  balance: Map<string, number>

  @Prop({ required: true, default: 0 })
  deposited: number;

  @Prop({ required: true, default: 0 })
  sale: number;

  @Prop({ required: true, default: 'new' })
  status: string;

  @Prop({ default: '' })
  comment: string;

  @Prop({ default: 0 })
  messagesCount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }] })
  transactions: Types.ObjectId[];
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
