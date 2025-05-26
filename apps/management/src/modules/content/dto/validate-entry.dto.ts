import { ApiProperty } from '@nestjs/swagger';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export class ValidateEntryValueDto {
  @ApiProperty({ example: 'title' })
  fieldName: string;

  @ApiProperty({ required: false, example: 'de' })
  locale?: string;

  @ApiProperty({ description: 'Value to validate', example: 'Hallo Welt' })
  value: any;
}

export class ValidateEntryDto {
  @ApiProperty({ description: 'Schema definition to validate against' })
  schemaDefinition: ContentSchemaDefinition;

  @ApiProperty({ type: [ValidateEntryValueDto] })
  values: ValidateEntryValueDto[];
}
