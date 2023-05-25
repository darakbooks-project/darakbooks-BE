import { ApiProperty } from '@nestjs/swagger';

export class photoDto {
  @ApiProperty({ example: 'img_name', description: 's3 img file name' })
  img_name: string;

  @ApiProperty({ example: 'img_url', description: 'se img file url' })
  img_url: string;
}