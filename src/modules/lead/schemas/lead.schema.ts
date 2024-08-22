import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type LeadDocument = Lead & Document;

@Schema({ versionKey: false, timestamps: true })
export class Lead {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  country: string;

  @Prop({
    required: true,
  })
  balance: Map<string, number>;

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

  @Prop({ required: true, default: 'usd' })
  currency: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }] })
  transactions: Types.ObjectId[];

  @Prop()
  user: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
