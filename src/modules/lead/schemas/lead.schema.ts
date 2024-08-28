import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type LeadDocument = Lead & Document;

@Schema({ versionKey: false, timestamps: true })
export class Lead {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false, default: '' })
  source: string;

  @Prop({
    required: true,
  })
  balance: Map<string, number>;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  retention: Types.ObjectId;

  @Prop({ required: true, default: 'new' })
  status: string;

  @Prop({ default: '' })
  comment: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  duplicated: Types.ObjectId;

  @Prop({ required: true, default: 'usd' })
  currency: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }] })
  transactions: Types.ObjectId[];

  @Prop()
  user: string;

  @Prop({
    type: {
      status: String,
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      country: String,
      address: String,
      city: String,
      zipCode: String,
      image: String,
      verifiedAt: Date,
      verificationType: String,
    },
    default: {},
  })
  verification: {
    status: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    country: string;
    address: string;
    city: string;
    zipCode: string;
    image: string;
    verificationType: string;
    verifiedAt?: Date;
  };
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });

LeadSchema.index({ createdAt: 1 }, { sparse: true });

LeadSchema.index({ sale: 1 }, { sparse: true });
LeadSchema.index({ country: 1 }, { sparse: true });
LeadSchema.index({ retention: 1 }, { sparse: true });

LeadSchema.index({ email: 'text' }, { sparse: true });
LeadSchema.index({ phone: 'text' }, { sparse: true });
LeadSchema.index({ lastName: 'text' }, { sparse: true });
LeadSchema.index({ firstName: 'text' }, { sparse: true });
