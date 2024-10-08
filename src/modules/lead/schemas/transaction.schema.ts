import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ versionKey: false, timestamps: { createdAt: true, updatedAt: true } })
export class Transaction extends Document {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true })
  lead: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: new Date() })
  date: string;

  @Prop({ default: 'Completed' })
  status: string;

  @Prop({ default: 'Deposit' })
  type: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
