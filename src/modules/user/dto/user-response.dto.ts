import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 11, description: 'Unique user ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  username: string;

  @ApiProperty({ example: 'ssss@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 2, description: 'Role ID assigned to the user' })
  roleId: number;

  @ApiProperty({ example: '2025-02-10T03:00:30.494Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-10T03:00:30.495Z', description: 'Last update timestamp' })
  updatedAt: string;
}
