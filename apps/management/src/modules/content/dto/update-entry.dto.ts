import { ApiProperty } from '@nestjs/swagger';
export class UpdateEntryDto {
  @ApiProperty({
    description: 'Entire content data blob to be stored',
    example: {
      title: { de: 'Hallo', en: 'Hello' },
      published: true,
    },
  })
  data: any;
}
