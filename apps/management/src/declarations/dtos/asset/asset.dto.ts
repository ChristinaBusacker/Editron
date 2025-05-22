import { ApiProperty } from '@nestjs/swagger';

// asset.dto.ts
export class EmblemTransformOptions {
  @ApiProperty({
    description:
      'The scaling factor for the SVG element. 1 represents the original size.',
    example: 0.5,
  })
  size: number;

  @ApiProperty({
    description:
      'The X-axis translation for the SVG element. Represents a percentage of the canvas width.',
    example: 0.28,
  })
  positionX: number;

  @ApiProperty({
    description:
      'The Y-axis translation for the SVG element. Represents a percentage of the canvas height.',
    example: 0.07,
  })
  positionY: number;

  @ApiProperty({
    description:
      'The color to apply to the SVG element, in hexadecimal format.',
    example: '#d90808',
  })
  color: string;
}

export class AssetDto {
  @ApiProperty({
    description: 'A unique identifier for the asset.',
    example: 'Emblem_3',
  })
  id: string;

  @ApiProperty({
    description: 'The SVG content of the asset.',
    example: '<svg>...</svg>',
  })
  content: string;

  @ApiProperty({
    description: 'Transformation options to apply to the SVG content.',
    type: EmblemTransformOptions,
  })
  transform: EmblemTransformOptions;
}
