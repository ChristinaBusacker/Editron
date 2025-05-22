import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SessionDto {
  @ApiProperty({
    description: 'Unique identifier for the session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the user associated with the session',
    example: '987e6543-b21a-34f6-c789-123456789abc',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Date when the session was created',
    example: '2024-08-15T12:34:56Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the session was last updated',
    example: '2024-08-15T14:34:56Z',
  })
  @Expose()
  updatedAt: Date;
}
