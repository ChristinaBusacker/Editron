import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryDto {
  @ApiProperty({
    description: 'Data of the Entry.',
    example: {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    },
  })
  data: any;
}
