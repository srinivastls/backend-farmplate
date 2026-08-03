import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // -------------------------------
  // Get Cart
  // -------------------------------

  async getCart(userId: string) {
  const cart = await this.prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              farm: {
                include: {
                  farmer: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const totalItems =
  cart?.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  ) ?? 0;

const totalAmount =
  cart?.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ) ?? 0;

  const items =
  cart?.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    totalPrice: item.price * item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      description: item.product.description,
      image: item.product.image,
      organic: item.product.organic,
      unit: item.product.unit,
      farmName: item.product.farm.name,
    },
  })) ?? [];

const subtotal = items.reduce(
  (sum, item) => sum + item.totalPrice,
  0,
);

const deliveryFee = subtotal > 500 ? 0 : 40;
const platformFee = subtotal > 0 ? 5 : 0;

const total = subtotal + deliveryFee + platformFee;

return {
  success: true,
  data: {
    items,
    totalItems,
    subtotal,
    deliveryFee,
    platformFee,
    total,
  },
};
}



  // -------------------------------
  // Add Item
  // -------------------------------
  

  async addItem(
    userId: string,
    dto: AddCartItemDto,
  ) {
    // Find product
    console.log("========== CART DEBUG ==========");
    console.log("Received userId:", userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("User found:", user);

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    console.log("Existing cart:", cart);
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: dto.productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    // Find or Create Cart

    // Find or Create Cart

if (!cart) {
  cart = await this.prisma.cart.create({
    data: {
      userId,
    },
  });
}

    // Check existing item

    const existing =
      await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: dto.productId,
        },
      });

    if (existing) {
      return this.prisma.cartItem.update({
        where: {
          id: existing.id,
        },

        data: {
          quantity:
            existing.quantity + dto.quantity,
        },
      });
    }

    // Create Item

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,

        productId: product.id,

        productName: product.name,

        unit: product.unit,

        price: product.price,

        quantity: dto.quantity,
      },
    });
  }

  async checkoutSummary(userId: string) {
  return this.getCart(userId);
}

  // -------------------------------
  // Update Quantity
  // -------------------------------

  async updateQuantity(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ) {
    
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      );
    }

    const item = await this.prisma.cartItem.findFirst({
  where: {
    id: itemId,
    cartId: cart.id,
  },
});

if (!item) {
  throw new NotFoundException('Cart item not found');
}

return this.prisma.cartItem.update({
  where: {
    id: item.id,
  },
  data: {
    quantity: dto.quantity,
  },
});
  }

  // -------------------------------
  // Remove Item
  // -------------------------------

  async removeItem(
    userId: string,
    itemId: string,
  ) {
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      );
    }

    const item = await this.prisma.cartItem.findFirst({
  where: {
    id: itemId,
    cartId: cart.id,
  },
});

if (!item) {
  throw new NotFoundException('Cart item not found');
}

return this.prisma.cartItem.delete({
  where: {
    id: item.id,
  },
});
  }

  // -------------------------------
  // Clear Cart
  // -------------------------------

  async clearCart(userId: string) {
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      );
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return {
      success: true,
      message: 'Cart cleared successfully',
    };
  }
}