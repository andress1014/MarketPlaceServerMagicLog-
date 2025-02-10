import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'John Doe', 
    description: 'Full name of the user' 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    example: 'johndoe@example.com', 
    description: 'User email' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'securepassword', 
    description: 'User password' 
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ 
    example: 'seller', 
    description: 'User role type', 
    enum: ['seller', 'customer']
  })
  @IsIn(['seller', 'customer'], { message: 'roleType must be either "seller" or "customer".' })
  @IsNotEmpty()
  roleType: string;
}
