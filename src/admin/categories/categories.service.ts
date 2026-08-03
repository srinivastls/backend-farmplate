import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return {
      success: true,
      data: await this.prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
    };
  }

  async create(dto: CreateCategoryDto) {
    const category =
      await this.prisma.category.create({
        data: dto,
      });

    return {
      success: true,
      message: 'Category created',
      data: category,
    };
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ) {
    const exists =
      await this.prisma.category.findUnique({
        where: { id },
      });

    if (!exists) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return {
      success: true,
      data: await this.prisma.category.update({
        where: { id },
        data: dto,
      }),
    };
  }

  async remove(id: string) {
    await this.prisma.category.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Category deleted',
    };
  }
}