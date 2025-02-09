import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ValidateProductMiddleware } from '../../middleware/validations/validate-product.middleware';
import { AuthGuard } from '../../middleware/guard/auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([Product, Category])], // 🔥 Agregamos Category
  controllers: [ProductController],
  providers: [ProductService, AuthGuard],
  exports: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateProductMiddleware)
      .forRoutes({ path: 'product/create', method: RequestMethod.POST });
  }
}
