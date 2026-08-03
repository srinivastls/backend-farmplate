import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';

import { CartService } from './cart.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'cart',
  version: '1',
})
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) {}

  @Get()
  getCart(
    @CurrentUser() user: any,
  ) {
    return this.cartService.getCart(
      user.id,
    );
  }

  @Get('checkout-summary')
  checkoutSummary(
    @CurrentUser() user: any,
  ) {
    return this.cartService.checkoutSummary(
      user.id,
    );
  }

  @Post('items')
  addItem(
    @CurrentUser() user: any,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(
      user.id,
      dto,
    );
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: any,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(
      user.id,
      itemId,
      dto,
    );
  }

  

  @Delete('items/:id')
  removeItem(
    @CurrentUser() user: any,
    @Param('id') itemId: string,
  ) {
    return this.cartService.removeItem(
      user.id,
      itemId,
    );
  }

  @Delete('clear')
  clear(
    @CurrentUser() user: any,
  ) {
    return this.cartService.clearCart(
      user.id,
    );
  }
}