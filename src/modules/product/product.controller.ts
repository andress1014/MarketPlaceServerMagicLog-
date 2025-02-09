import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, Query, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../../models/product.model';
import { AuthGuard } from '../../middleware/guard/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any): Promise<Product> {
    return this.productService.createProduct(createProductDto, req.user.id);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('my-products')
  @UseGuards(AuthGuard)
  async findMyProducts(@Request() req: any): Promise<Product[]> {
    return this.productService.findProductsBySeller(req.user.id);
  }

  @Get('admin-products')
  @UseGuards(AuthGuard)
  async findAdminProducts(@Request() req: any, @Query('sellerId') sellerId?: number): Promise<Product[]> {
    if (req.user.roleId !== 1) {
      throw new ForbiddenException('Only admins can access this route.');
    }
    return this.productService.findAllProducts(sellerId);
  }

  @Get('list-customer-products')
  async listCustomerProducts(@Query('category') category?: number): Promise<Product[]> {
    return this.productService.findAvailableProducts(category);
  }

  // 🔥 Nuevo endpoint para actualizar un producto
  @Put('update/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: Partial<CreateProductDto>, @Request() req: any): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto, req.user.id, req.user.roleId);
  }

  // 🔥 Nuevo endpoint para eliminar un producto
  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id: number, @Request() req: any): Promise<{ message: string }> {
    return this.productService.deleteProduct(id, req.user.id, req.user.roleId);
  }
}
