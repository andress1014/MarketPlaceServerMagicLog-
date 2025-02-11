import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../../models/category.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}

  /**
   *
   * @param createProductDto
   * @param userId
   * @returns Product
   */
  async createProduct(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const { categoryId } = createProductDto;

    const category = await this.categoryModel.findByPk(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    try {
      return await this.productModel.create({
        ...createProductDto,
        userId,
      } as Product);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          'SKU already exists. Please use a different SKU.',
        );
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the product.',
      );
    }
  }

  /**
   * @returns Product[]
   * @throws InternalServerErrorException
   * @description Retrieves all products
   */
  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving products.',
      );
    }
  }

  /**
   *
   * @param id
   * @returns Product
   * @throws NotFoundException
   * @throws InternalServerErrorException
   */
  async findProductsBySeller(userId: number): Promise<Product[]> {
    try {
      return await this.productModel.findAll({ where: { userId } });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving products by seller.',
      );
    }
  }

  /**
   *
   * @param id
   * @returns Product
   * @throws NotFoundException
   * @throws InternalServerErrorException
   */
  async findAllProducts(sellerId?: number): Promise<Product[]> {
    const whereCondition = sellerId ? { userId: sellerId } : {};
    try {
      return await this.productModel.findAll({ where: whereCondition });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving all products.',
      );
    }
  }

  async findAvailableProducts(categoryId?: number): Promise<Product[]> {
    const whereCondition: any = { isActive: true };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    try {
      return await this.productModel.findAll({ where: whereCondition });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving available products.',
      );
    }
  }

  /**
   *  @param id
   * @param updateProductDto
   * @returns Product
   */
  async updateProduct(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
    userId: number,
    roleId: number,
  ): Promise<Product> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    if (product.userId !== userId && roleId !== 1) {
      throw new ForbiddenException(
        'You do not have permission to update this product.',
      );
    }

    try {
      await product.update(updateProductDto);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the product.',
      );
    }
  }

  async deleteProduct(
    id: number,
    userId: number,
    roleId: number,
  ): Promise<{ message: string }> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    if (product.userId !== userId && roleId !== 1) {
      throw new ForbiddenException(
        'You do not have permission to delete this product.',
      );
    }

    try {
      await product.destroy();
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the product.',
      );
    }
  };


  /**
   * @description Retrieves all products by category
   * @returns Category[]
   */
  getAllCategoryProducts(): Promise<Category[]> {
    try {
      return this.categoryModel.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving products by category.',
      );
    }
  }
}
