import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'email@address.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'This is the Subject' })
  @MinLength(10, { message: 'Subject must be at least 10 characters long' })
  subject: string;

  @ApiProperty({
    example: { username: 'Karl' },
    description: 'Data to replace in the template',
  })
  data: Record<string, any>;
}
