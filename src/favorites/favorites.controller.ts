import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({
  path: "favorites",
  version: "1",
})
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  getFavorites(
    @CurrentUser() user: any,
  ) {
    return this.favoritesService.getFavorites(
      user.id,
    );
  }

  @Post()
  add(
    @CurrentUser() user: any,
    @Body() body: { productId: string },
  ) {
    return this.favoritesService.add(
      user.id,
      body.productId,
    );
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: any,
    @Param("id") id: string,
  ) {
    return this.favoritesService.remove(
      user.id,
      id,
    );
  }
}