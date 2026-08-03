import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: "users",
  version: "1",
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get("profile")
  profile(
    @CurrentUser() user: any,
  ) {
    return this.usersService.profile(
      user.id,
    );
  }

  @Patch("profile")
  updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      user.id,
      dto,
    );
  }

  @Patch("change-password")
  changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      user.id,
      dto,
    );
  }
}