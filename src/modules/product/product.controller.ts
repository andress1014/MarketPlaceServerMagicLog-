import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, Query, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AuthGuard } from '../../config/guard/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProductDto })
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any): Promise<ProductResponseDto> {
    const product = await this.productService.createProduct(createProductDto, req.user.id);
    return this.mapToProductResponseDto(product);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Returns all products', type: [ProductResponseDto] })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productService.findAll();
    return products.map(this.mapToProductResponseDto);
  }

  @Get('my-products')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products created by the authenticated seller' })
  @ApiResponse({ status: 200, description: 'Returns products created by the authenticated seller', type: [ProductResponseDto] })
  async findMyProducts(@Request() req: any): Promise<ProductResponseDto[]> {
    const products = await this.productService.findProductsBySeller(req.user.id);
    return products.map(this.mapToProductResponseDto);
  }

  @Get('admin-products')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all products, with optional seller filtering', type: [ProductResponseDto] })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can access this route' })
  async findAdminProducts(@Request() req: any, @Query('sellerId') sellerId?: number): Promise<ProductResponseDto[]> {
    if (req.user.roleId !== 1) {
      throw new ForbiddenException('Only admins can access this route.');
    }
    const products = await this.productService.findAllProducts(sellerId);
    return products.map(this.mapToProductResponseDto);
  }

  @Get('list-customer-products')
  @ApiOperation({ summary: 'List products available for customers' })
  @ApiResponse({ status: 200, description: 'Returns available products', type: [ProductResponseDto] })
  async listCustomerProducts(@Query('category') category?: number): Promise<ProductResponseDto[]> {
    const products = await this.productService.findAvailableProducts(category);
    return products.map(this.mapToProductResponseDto);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not the owner' })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: Partial<CreateProductDto>, @Request() req: any): Promise<ProductResponseDto> {
    const product = await this.productService.updateProduct(id, updateProductDto, req.user.id, req.user.roleId);
    return this.mapToProductResponseDto(product);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not the owner' })
  async deleteProduct(@Param('id') id: number, @Request() req: any): Promise<{ message: string }> {
    return this.productService.deleteProduct(id, req.user.id, req.user.roleId);
  }

  // 🔥 Método para convertir `Product` en `ProductResponseDto`
  private mapToProductResponseDto(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      price: product.price,
      categoryId: product.categoryId,
      userId: product.userId,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
