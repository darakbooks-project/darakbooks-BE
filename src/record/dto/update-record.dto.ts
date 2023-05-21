import { PartialType } from '@nestjs/swagger';
import { CreateRecordDTO } from './create-record.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDto extends PartialType(CreateRecordDTO) {
    @IsOptional()
    @IsString()
    bookIsbn: string;

    @IsOptional()
    @IsString()
    text: string;

    @IsOptional()
    @IsString()
    recordImg: string;
  
    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    readAt: string;
  

}
