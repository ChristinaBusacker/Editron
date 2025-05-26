import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryDto {
  @ApiProperty({
    description:
      'Unique key to identify the entry within the schema and project.',
    example: 'impressum',
  })
  key: string;
}
