import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  async create(@Request() req, @Body() body: CreateUserDto) {
    const { userId, email } = req.user;
    return this.service.create({ ...body, id: userId, email });
  }

  @Get('me')
  async getMe(@Request() req) {
    return this.service.findOne(req.user.userId);
  }
}
