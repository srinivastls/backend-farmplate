import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
  name: string;
  email: string;
  password?: string | null;
}) {
  return this.prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password ?? null,
    },
  });
}
}