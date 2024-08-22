import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './chat.schema';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
