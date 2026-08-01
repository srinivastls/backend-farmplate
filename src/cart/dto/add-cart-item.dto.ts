import { IsNumber, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(0.1)
  quantity!: number;
}