import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../models/user.model';
import { AuthGuard } from '../../middleware/guard/auth.guard'; // 🔥 Importamos el guard de autenticación

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 🔥 Nuevo endpoint para listar solo vendedores, protegido con JWT y solo accesible por admins
  @Get('sellers')
  @UseGuards(AuthGuard) // 🔒 Protegemos con JWT
  async findSellers(@Request() req: any): Promise<User[]> {
    if (req.user.roleId !== 1) {
      throw new ForbiddenException('Only admins can access this route.');
    }

    return this.userService.findSellers();
  }
}
