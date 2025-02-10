import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @ApiProperty({ example: 'Wireless Mouse', description: 'Product name' })
  name: string;

  @ApiProperty({ example: 'WM12345', description: 'Unique SKU' })
  sku: string;

  @ApiProperty({ example: 50, description: 'Available quantity' })
  quantity: number;

  @ApiProperty({ example: 29.99, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: 2, description: 'Category ID' })
  categoryId: number;

  @ApiProperty({ example: 3, description: 'User ID of the seller' })
  userId: number;

  @ApiProperty({ example: '2025-02-10T03:00:30.494Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-10T03:00:30.495Z', description: 'Last update timestamp' })
  updatedAt: string;
}
