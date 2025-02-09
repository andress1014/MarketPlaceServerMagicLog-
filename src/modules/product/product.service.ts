import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../../models/category.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(Category) private readonly categoryModel: typeof Category
  ) {}

  async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const { categoryId } = createProductDto;

    const category = await this.categoryModel.findByPk(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    try {
      return await this.productModel.create({ ...createProductDto, userId } as Product);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('SKU already exists. Please use a different SKU.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findProductsBySeller(userId: number): Promise<Product[]> {
    return this.productModel.findAll({ where: { userId } });
  }

  async findAllProducts(sellerId?: number): Promise<Product[]> {
    const whereCondition = sellerId ? { userId: sellerId } : {};
    return this.productModel.findAll({ where: whereCondition });
  }

  async findAvailableProducts(categoryId?: number): Promise<Product[]> {
    const whereCondition: any = { isActive: true };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    return this.productModel.findAll({ where: whereCondition });
  }

  // 🔥 Método para actualizar un producto
  async updateProduct(id: number, updateProductDto: Partial<CreateProductDto>, userId: number, roleId: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    // 🔒 Solo el creador o un administrador pueden editar
    if (product.userId !== userId && roleId !== 1) {
      throw new ForbiddenException('You do not have permission to update this product.');
    }

    await product.update(updateProductDto);
    return product;
  }

  // 🔥 Método para eliminar un producto
  async deleteProduct(id: number, userId: number, roleId: number): Promise<{ message: string }> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    // 🔒 Solo el creador o un administrador pueden eliminar
    if (product.userId !== userId && roleId !== 1) {
      throw new ForbiddenException('You do not have permission to delete this product.');
    }

    await product.destroy();
    return { message: 'Product deleted successfully' };
  }
}
