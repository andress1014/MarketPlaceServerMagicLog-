import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AuthGuard } from '../../config/guard/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { redisClient } from 'src/config/Cache/cache.module';

const { REDIS_KEY_PRODUCT, REDIS_TTL } = process.env;

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProductDto })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    try {
      const product = await this.productService.createProduct(
        createProductDto,
        req.user.id,
      );
      const response = this.mapToProductResponseDto(product);

      // Actualizar la caché de Redis
      await this.updateRedisCache();

      return response;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw new InternalServerErrorException('Error creating product');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Returns all products',
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productService.findAll();
      return products.map(this.mapToProductResponseDto);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  @Get('my-products')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products created by the authenticated seller' })
  @ApiResponse({
    status: 200,
    description: 'Returns all products created by the authenticated seller',
    type: [ProductResponseDto],
  })
  async findMyProducts(@Request() req: any): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productService.findProductsBySeller(
        req.user.id,
      );
      return products.map(this.mapToProductResponseDto);
    } catch (error) {
      console.error('❌ Error fetching user products:', error);
      throw new InternalServerErrorException('Error fetching user products');
    }
  }

  @Get('admin-products')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns all products',
    type: [ProductResponseDto],
  })
  async findAdminProducts(
    @Request() req: any,
    @Query('sellerId') sellerId?: number,
  ): Promise<ProductResponseDto[]> {
    try {
      if (req.user.roleId !== 1) {
        throw new ForbiddenException('Only admins can access this route.');
      }
      const products = await this.productService.findAllProducts(sellerId);
      return products.map(this.mapToProductResponseDto);
    } catch (error) {
      console.error('❌ Error fetching admin products:', error);
      throw new InternalServerErrorException('Error fetching admin products');
    }
  }

  @Get('list-customer-products')
  @ApiOperation({ summary: 'Get customer products' })
  @ApiResponse({
    status: 200,
    description: 'Returns all products',
    type: [ProductResponseDto],
  })
  @ApiOperation({ summary: 'List products available for customers' })
  async listCustomerProducts(
    @Query('category') category?: number,
  ): Promise<ProductResponseDto[]> {
    try {
      const cachedProducts = await redisClient.get(String(REDIS_KEY_PRODUCT));
      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }

      const products =
        await this.productService.findAvailableProducts(category);
      const response = products.map(this.mapToProductResponseDto);

      await redisClient.setex(
        String(REDIS_KEY_PRODUCT),
        Number(REDIS_TTL),
        JSON.stringify(response),
      );

      return response;
    } catch (error) {
      console.error('❌ Error fetching customer products:', error);
      throw new InternalServerErrorException(
        'Error fetching customer products',
      );
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    try {
      const product = await this.productService.updateProduct(
        id,
        updateProductDto,
        req.user.id,
        req.user.roleId,
      );

      // Actualizar la caché de Redis
      await this.updateRedisCache();

      return this.mapToProductResponseDto(product);
    } catch (error) {
      console.error(`❌ Error updating product ID ${id}:`, error);
      throw new InternalServerErrorException(`Error updating product ID ${id}`);
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  async deleteProduct(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    try {
      const result = await this.productService.deleteProduct(
        id,
        req.user.id,
        req.user.roleId,
      );

      // Actualizar la caché de Redis
      await this.updateRedisCache();

      return result;
    } catch (error) {
      console.error(`❌ Error deleting product ID ${id}:`, error);
      throw new InternalServerErrorException(`Error deleting product ID ${id}`);
    }
  }

  @Get('category')
  async getAllCategoryProducts(): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productService.getAllCategoryProducts();
      return products.map(this.mapToProductResponseDto);
    } catch (error) {
      console.error('❌ Error fetching category products:', error);
      throw new InternalServerErrorException(
        'Error fetching category products',
      );
    }
  }

  private mapToProductResponseDto(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      price: product.price,
      categoryId: product.categoryId,
      userId: product.userId,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    };
  }

  // Función privada para actualizar la caché de Redis
  private async updateRedisCache(): Promise<void> {
    try {
      // Eliminar la caché existente
      await redisClient.del(String(REDIS_KEY_PRODUCT));

      // Obtener y actualizar la caché con los productos disponibles
      const products = await this.productService.findAvailableProducts();
      const updatedProducts = products.map(this.mapToProductResponseDto);

      await redisClient.setex(
        String(REDIS_KEY_PRODUCT),
        Number(REDIS_TTL),
        JSON.stringify(updatedProducts),
      );
    } catch (error) {
      console.error('❌ Error updating Redis cache:', error);
      throw new InternalServerErrorException('Error updating Redis cache');
    }
  }
}