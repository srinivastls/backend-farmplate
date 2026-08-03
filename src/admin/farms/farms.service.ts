import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const farms =
    await this.prisma.farm.findMany({

  include: {
  farmer: {
    include: {
      user: true,
    },
  },
  products: true,
},

  orderBy: {

    createdAt: 'desc',

  },

});

    return {
      success: true,
      data: farms,
    };
  }

  async findOne(id: string) {
    const farm =
      await this.prisma.farm.findUnique({
        where: { id },
        include: {
  farmer: {
    include: {
      user: true,
    },
  },
  products: true,
},
      });

    if (!farm) {
      throw new NotFoundException(
        'Farm not found',
      );
    }

    return {
      success: true,
      data: farm,
    };
  }

  async create(dto: CreateFarmDto) {

  const farmer =
      await this.prisma.farmer.findUnique({

    where: {
      id: dto.farmerId,
    },

  });

  if (!farmer) {
    throw new NotFoundException(
      'Farmer not found',
    );
  }

  const farm =
      await this.prisma.farm.create({

    data: {

      farmerId: dto.farmerId,

      name: dto.name,

      description: dto.description,

      latitude: dto.latitude,

      longitude: dto.longitude,

      address: dto.address,

      image: dto.image,

    },

  });

  return {

    success: true,

    message: 'Farm created successfully',

    data: farm,

  };

}

  async update(
  id: string,
  dto: UpdateFarmDto,
) {

  const farm =
      await this.prisma.farm.findUnique({

    where: {
      id,
    },

  });

  if (!farm) {
    throw new NotFoundException(
      'Farm not found',
    );
  }

  return {

    success: true,

    data: await this.prisma.farm.update({

      where: {
        id,
      },

      data: dto,

    }),

  };

}

  async remove(id: string) {
    await this.prisma.farm.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Farm deleted successfully',
    };
  }
}