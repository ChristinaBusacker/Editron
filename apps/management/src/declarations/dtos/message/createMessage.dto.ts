import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'ID of the recipient team' })
  recipient: string;

  @ApiProperty({ description: 'Subject of the message' })
  subject: string;

  @ApiProperty({ description: 'Content of the message' })
  message: string;

  @ApiProperty({ description: 'Is this a system message?', default: false })
  isSystemMessage?: boolean = false;
}
