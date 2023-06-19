import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class gptDTO {
  @IsString()
  @ApiProperty({ example: '유현준의 인문 건축 기행', description: '책 제목' })
  Title: string;

  @IsString()
  @ApiProperty({ example: '유현준', description: '책 작가' })
  Author: string;

  @IsString()
  @ApiProperty({ example: '9788932423050', description: '책 isbn' })
  ISBN: string;

  @IsString()
  @ApiProperty({
    example:
      'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788932474892.jpg',
    description: '책표지 url',
  })
  Image: string;

  @IsString()
  @ApiProperty({
    example:
      '이 책은 작가 유현준이 쓴 건축을 인문학적으로 바라본 전세계의 신기한 건물들에 관한 따뜻한 이야기입니다.',
    description: '책 소개',
  })
  Intro: string;

  @IsString()
  @ApiProperty({
    example:
      '이 책은 건축물 속에 담긴 독특한 생각들을 탐색하는 내용입니다. 요새 건축물과 예술에 관심이 생긴 당신에게 적합하기때문에 추천하는 책입니다.',
    description: 'gpt가 이 책을 추천하는 이유',
  })
  Reason: string;
}
