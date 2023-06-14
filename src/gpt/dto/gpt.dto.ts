import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class gptDTO {
  @IsString()
  @ApiProperty({ example: '유현준의 인문 건축 기행', description: '책 제목' })
  title: string;

  @IsString()
  @ApiProperty({ example: '유현준', description: '책 작가' })
  author: string;

  @IsString()
  @ApiProperty({ example: '9788932423050', description: '책 isbn' })
  isbn: string;

  @IsString()
  @ApiProperty({
    example:
      '이 책은 건축물 속에 담긴 독특한 생각들을 탐색하는 내용입니다. 요새 건축물과 예술에 관심이 생긴 당신에게 추천하는 책입니다.',
    description: 'gpt가 이 책을 추천하는 이유',
  })
  reason: string;
}
