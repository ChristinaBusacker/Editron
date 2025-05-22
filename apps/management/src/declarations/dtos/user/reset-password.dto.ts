import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address to reset the password',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
