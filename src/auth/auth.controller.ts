import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import {
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FirebaseLoginDto } from './dto/firebase-login.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Post('firebase')
firebaseLogin(
  @Body() dto: FirebaseLoginDto,
) {
  return this.authService.firebaseLogin(dto);
}
  @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@Req() req: any) {
    return req.user;
    }
}