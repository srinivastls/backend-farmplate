import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getNotifications(userId: string) {
    const notifications =
        await this.prisma.notification.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: notifications,
    };
  }

  async markRead(
    userId: string,
    id: string,
  ) {
    await this.prisma.notification.updateMany({
      where: {
        id,
        userId,
      },

      data: {
        isRead: true,
      },
    });

    return {
      success: true,
    };
  }

  async markAllRead(
    userId: string,
  ) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },

      data: {
        isRead: true,
      },
    });

    return {
      success: true,
    };
  }

  async createNotification({
    userId,
    title,
    message,
    type,
  }: {
    userId: string;
    title: string;
    message: string;
    type: any;
  }) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }
}