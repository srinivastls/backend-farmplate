import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { FirebaseService } from './firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Registration successful',
      accessToken: this.jwtService.sign(payload),
      // need the name
      user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
    };
  }

  async firebaseLogin(dto: FirebaseLoginDto) {
  const decoded =
    await this.firebaseService.verifyToken(dto.idToken);

  let user =
    await this.usersService.findByEmail(decoded.email!);

  if (!user) {
    user = await this.usersService.createUser({
      name: decoded.name ?? 'Google User',
      email: decoded.email!,
      password: null!,
    });
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: this.jwtService.sign(payload),
    user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  };
}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
    };
  }
}