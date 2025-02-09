import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, roleType } = createUserDto;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const roleId = roleType === 'seller' ? 2 : 3;

    const user = await this.userModel.create({
      username,
      email,
      password,
      roleId,
    } as User);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['code'] }],
    });
  }

  // 🔥 Método para listar solo los vendedores (roleId = 2)
  async findSellers(): Promise<User[]> {
    return this.userModel.findAll({
      where: { roleId: 3 },
      include: [{ model: Role, attributes: ['code'] }],
    });
  }
}
