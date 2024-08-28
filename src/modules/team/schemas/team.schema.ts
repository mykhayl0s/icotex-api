import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: '' })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  manager: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  teamLeads: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  sales: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  retentions: Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ sales: 1 }, { sparse: true });
TeamSchema.index({ manager: 1 }, { sparse: true });
TeamSchema.index({ teamLeads: 1 }, { sparse: true });
TeamSchema.index({ retentions: 1 }, { sparse: true });
