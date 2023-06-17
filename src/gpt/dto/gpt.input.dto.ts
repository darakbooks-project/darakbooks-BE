import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class gptInputDTO {
  @IsString()
  @ApiProperty({
    example: 'Recommend a book to read on a sad day.',
    description: '유저의 추천 요청 텍스트. 프론트에서 영어로 번역해서 넘겨주기',
  })
  userInput: string;
}
