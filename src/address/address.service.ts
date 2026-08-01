import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });
  }

  async create(
    userId: string,
    dto: CreateAddressDto,
  ) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAddressDto,
  ) {
    const address =
        await this.prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException(
        'Address not found',
      );
    }

    if (dto.isDefault == true) {
      await this.prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.address.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    userId: string,
    id: string,
  ) {
    const address =
        await this.prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException(
        'Address not found',
      );
    }

    await this.prisma.address.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Address deleted",
    };
  }
}