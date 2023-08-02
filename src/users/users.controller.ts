import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
