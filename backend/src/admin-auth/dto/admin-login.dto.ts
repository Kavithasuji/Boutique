import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    example: 'admin@cupidanza.com',
    description: 'Administrator email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Administrator password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}