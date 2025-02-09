import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // 🔥 Importamos el UserModule
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule], // 🔥 Agregamos UserModule
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
