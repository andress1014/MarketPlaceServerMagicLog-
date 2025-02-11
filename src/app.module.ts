import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/postgres.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { User } from './models/user.model';
import { Role } from './models/role.model';
import { Product } from './models/product.model';
import { CacheConfigModule } from './config/Cache/cache.module'; // ✅ Importa correctamente

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SequelizeModule.forFeature([User, Role, Product]),
    CacheConfigModule, // ✅ Usa CacheConfigModule con ioredis
    UserModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
