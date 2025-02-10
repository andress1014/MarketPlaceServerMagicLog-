import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto'; // ✅ Importamos el DTO de respuesta
import { AuthGuard } from '../../config/guard/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto }) // ✅ Cambiamos la respuesta esperada
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    
    // ✅ Devolver solo los campos necesarios (sin contraseña)
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }


  @Get('sellers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sellers (Admins only)' })
  @ApiResponse({ status: 200, type: [UserResponseDto] }) // ✅ Cambiamos la respuesta esperada
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can access this route' })
  async findSellers(@Request() req: any): Promise<UserResponseDto[]> {
    if (req.user.roleId !== 1) {
      throw new ForbiddenException('Only admins can access this route.');
    }

    const sellers = await this.userService.findSellers();
    return sellers.map(seller => ({
      id: seller.id,
      username: seller.username,
      email: seller.email,
      roleId: seller.roleId,
      createdAt: seller.createdAt.toISOString(),
      updatedAt: seller.updatedAt.toISOString()
    }));
  }
}
