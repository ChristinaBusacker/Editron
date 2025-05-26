import { ApiProperty } from '@nestjs/swagger';

class EntryValueDto {
  @ApiProperty({ example: 'title' })
  fieldName: string;

  @ApiProperty({ required: false, example: 'en' })
  locale?: string;

  @ApiProperty({ description: 'Field content value', example: 'About us' })
  value: any;
}

export class UpdateEntryDto {
  @ApiProperty({ type: [EntryValueDto] })
  values: EntryValueDto[];
}
