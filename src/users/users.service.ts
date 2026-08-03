import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { BadRequestException } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

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

async profile(userId: string) {

  const user =
      await this.prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
    },
  });

  return {
    success: true,
    data: user,
  };
}

async updateProfile(
  userId: string,
  dto: UpdateProfileDto,
) {

  const user =
      await this.prisma.user.update({

    where: {
      id: userId,
    },

    data: {
      name: dto.name,
      phone: dto.phone,
      image: dto.image,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  return {
    success: true,
    message: "Profile updated",
    data: user,
  };
}

async changePassword(
  userId: string,
  dto: ChangePasswordDto,
) {

  const user = await this.prisma.user.findUnique({
  where: {
    id: userId,
  },
});

if (!user) {
  throw new BadRequestException("User not found");
}

if (user.password === null) {
  throw new BadRequestException(
    "This account was created using Google Sign-In and does not have a password."
  );
}

const match = await bcrypt.compare(
  dto.oldPassword,
  user.password,
);

if (!match) {
  throw new BadRequestException("Old password is incorrect");
}

const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

await this.prisma.user.update({
  where: {
    id: userId,
  },
  data: {
    password: hashedPassword,
  },
});

return {
  success: true,
  message: "Password changed successfully",
};
}


}