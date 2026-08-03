import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getNotifications(
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.getNotifications(
      user.id,
    );
  }

  @Patch(':id/read')
  markRead(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markRead(
      user.id,
      id,
    );
  }

  @Patch('read-all')
  markAllRead(
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAllRead(
      user.id,
    );
  }
}