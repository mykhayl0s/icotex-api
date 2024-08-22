import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserPayload } from 'src/common/roles.guard';
import { AuthUser } from 'src/common/user.decorator';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller()
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMessages(@AuthUser() user: AuthUserPayload) {
    return this.chatService.getMessages(user._id);
  }
}
