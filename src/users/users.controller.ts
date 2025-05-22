import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Request() req, @Body() body: CreateUserDto) {
    const { userId, email } = req.user;
    return this.usersService.createUser({ ...body, id: userId, email });
  }
}
