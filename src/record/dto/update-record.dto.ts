import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRecordDTO } from './create-record.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDto extends PartialType(CreateRecordDTO) {
    @ApiProperty({ example: '39834244', description: 'bookIsbn' })
    @IsOptional()
    @IsString()
    bookIsbn: string;

    @ApiProperty({ example: '다음권이 너무 궁금하다. ', description: 'text' })
    @IsOptional()
    @IsString()
    text: string;

    @ApiProperty({ example: '1684897517164_86', description: 'recordImg' })
    @IsOptional()
    @IsString()
    recordImg: string;

    @ApiProperty({ example: "https://avostorage.s3.amazonaws.com/1684897517164_86", description: 'recordImgUrl' })
    @IsOptional()
    @IsString()
    recordImgUrl: string;

    @ApiProperty({ example: [{"id": 1, "data": "tag1"}, {"id": 2, "data": "tag2"}, {"id": 3, "data": "tag3"}], description: 'tags' })
    @IsOptional()
    @IsArray()
    tags: { id: number, data: string }[] ;

    @ApiProperty({ example: '2023-05-23', description: 'readAt' })   
    @IsOptional()
    @IsString()
    readAt: string;
  

}
