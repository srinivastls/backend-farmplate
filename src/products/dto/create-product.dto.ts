import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  farmId!: string;

  @IsString()
  categoryId!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  quantity!: number;

  @IsString()
  unit!: string;

  @IsBoolean()
  organic!: boolean;

  @IsDateString()
  harvestTime!: string;

  @IsOptional()
  @IsString()
  image?: string;
}