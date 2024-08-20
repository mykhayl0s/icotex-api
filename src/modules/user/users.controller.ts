import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RequestWithUser, RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ERole } from 'src/common/roles.enum';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('user-info')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  protected(@Req() req: RequestWithUser) {
   return req.user
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  //}
}
