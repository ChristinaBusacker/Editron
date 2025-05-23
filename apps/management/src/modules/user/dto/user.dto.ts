import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SuperSecure123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'Jane Updated', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'new@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'NewPassword123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
