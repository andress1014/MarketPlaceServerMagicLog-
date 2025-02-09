import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Importamos ConfigModule
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/postgres.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module'; // ✅ Importamos el módulo de productos
import { User } from './models/user.model';
import { Role } from './models/role.model';
import { Product } from './models/product.model'; // ✅ Importamos el modelo de producto

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Cargar variables de entorno
    DatabaseModule,
    SequelizeModule.forFeature([User, Role, Product]), // ✅ Agregar `Product` aquí
    UserModule, 
    AuthModule, 
    ProductModule, // ✅ Agregar el módulo de productos aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
