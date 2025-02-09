import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['seller', 'customer'], { message: 'roleType must be either "seller" or "customer".' })
  roleType: string;
}
