import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../models/user.model';
import { ValidateUserMiddleware } from '../../middleware/validations/validate-user.middleware'; // 🔥 Importamos el middleware

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 🔥 Exportamos UserService para que otros módulos lo usen
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateUserMiddleware) // 🔥 Aplicamos el middleware
      .forRoutes({ path: 'user/register', method: RequestMethod.POST }); // 🔥 Solo para la ruta de registro
  }
}
