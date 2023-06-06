import { IsArray, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class gptDTO {
  @IsString()
  @ApiProperty({ example: 'bookIsbn', description: 'bookIsbn' })
  bookIsbn: string;

  @IsString()
  @ApiProperty({ example: 'title', description: 'title' })
  title: string;

  @IsArray()
  @ApiProperty({ example: 'authors', description: 'authors' })
  authors: string[];

  @IsString()
  @ApiProperty({ example: 'publisher', description: 'publisher' })
  publisher: string;

  @IsString()
  @ApiProperty({ example: 'thumbnail', description: 'image' })
  thumbnail: string;
}
