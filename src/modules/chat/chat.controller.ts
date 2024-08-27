import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import {AuthUser} from '../../common/user.decorator';
import {AuthUserPayload} from '../../common/roles.guard';

@Controller()
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMessages(@Param('user') user: string, @AuthUser() authUser: AuthUserPayload,) {
    return this.chatService.getMessages(user, authUser);
  }

  @Get('count/:user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getNewMessagesCount(@Param('user') user: string) {
    return this.chatService.getNewMessagesCount(user);
  }
}
