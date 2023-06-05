import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRecordDTO } from './create-record.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDto extends PartialType(CreateRecordDTO) {
    @ApiPropertyOptional({ example: '8996991341', description: 'bookIsbn' })
    @IsOptional()
    @IsString()
    bookIsbn: string;

    @ApiPropertyOptional({ example: '다음권이 너무 궁금하다. ', description: '독서기록' })
    @IsOptional()
    @IsString()
    text: string;

    @ApiPropertyOptional({ example: '1684897517164_86', description: '독서기록의 사진 name(key)' })
    @IsOptional()
    @IsString()
    recordImg: string;

    @ApiPropertyOptional({ example: "https://avostorage.s3.amazonaws.com/1684897517164_86", description: '독서기록의 사진 url' })
    @IsOptional()
    @IsString()
    recordImgUrl: string;

    @ApiPropertyOptional({ example: [{"id": 1, "data": "마음단단"}, {"id": 2, "data": "자기계발"}], description: '독서기록의 tag' })
    @IsOptional()
    @IsArray()
    tags: { id: number, data: string }[] ;

    @ApiPropertyOptional({ example: '2023-05-23', description: '읽은 날짜' })   
    @IsOptional()
    @IsString()
    readAt: string;
  

}
