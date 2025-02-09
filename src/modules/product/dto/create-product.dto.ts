import { IsString, IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  categoryId: number; // 🔥 Se agrega la categoría al DTO
}
