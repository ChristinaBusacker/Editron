import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class OfferContractDto {
  @ApiProperty({
    description: 'Unique identifier for the driver to make the offer to',
    example: '987e6543-b21a-34f6-c789-123456789abc',
  })
  @IsUUID()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty({ description: 'Salery per Race', example: 8552 })
  @IsNotEmpty()
  salary: number;

  @ApiProperty({ description: 'Season when the contract starts', example: 5 })
  @IsNotEmpty()
  startSeason: number;

  @ApiProperty({ description: 'Season when the contract ends', example: 6 })
  @IsNotEmpty()
  endSeason: number;

  @ApiProperty({
    description: 'Fixed bonus when drivers signes the contract',
    example: 6,
  })
  @IsNotEmpty()
  signingBonus: number;

  @ApiProperty({
    description: 'Bonus for reaching the targetThreshold',
    example: 6,
  })
  @IsNotEmpty()
  targetBonus: number;

  @ApiProperty({
    description: 'Minimum place to reach to get the bonus',
    example: 2,
  })
  @IsNotEmpty()
  targetThreshold: number;
}
