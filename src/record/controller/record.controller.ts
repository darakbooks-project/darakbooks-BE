import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseFilters,Req, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { RecordService } from '../service/record.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { recordDTO } from '../dto/record.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfoud.filter';
import { OwnerAuthGuard } from 'src/auth/owner/owner-auth.guard';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { Request , Response} from 'express';
import { S3Service } from 'src/common/s3.service';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { photoDto } from '../dto/photo.dto';
import { Record } from '../record.entity';

interface JwtPayload {
  userId: string;
}

@ApiTags('record')
@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService,private readonly s3Service: S3Service ) {}

  @ApiOperation({summary: 'record 사진 등록'})
  @ApiResponse({status:201, type: photoDto})
  @ApiInternalServerErrorResponse({status:500, description:'Server ERROR: File upload failed :'})
  @Post('/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File){
    const result = await this.s3Service.uploadFile(file);
    return result;
  }

  @ApiOperation({summary: '독서기록 등록'})
  @ApiResponse({status:201, type: Record})
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Token expired' }) 
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Invalid token' }) 
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDTO: recordDTO,  @Req() req: Request) {
    const create_record_DTO = createDTO.record;
    const user =  req.user as JwtPayload;
    create_record_DTO.userId = user.userId;
    const book_DTO = createDTO.book;
    const record = await this.recordService.create(create_record_DTO);
    //책db에 책 저장하기 
    return record ; //post return 할 때는 그냥 tag로 string으로만 보내는데 괜찮나? 
  }

  @ApiOperation({summary: '전달한 BookId와 일치하는 독서기록 요청'})
  @ApiResponse({status:200, type:[Record]})
  @Get()
  async getRecords(
    @Query('bookID') bookIsbn: string, 
    @Query('lastId') lastId: number, 
    @Query('pageSize') pageSize: number) {
    if (bookIsbn) {
      // bookID를 사용하여 작업 수행
      // 예: bookID를 이용해 데이터 조회 등
      const records = await this.recordService.getRecordsByLastIdAndBookId(lastId,pageSize,bookIsbn);
      return records;
    } else {
      // bookID가 없을 경우의 동작 처리
      const records = await this.recordService.getRecordsByLastId(lastId, pageSize);
      return records;
    }
  }
  @ApiOperation({summary: '전달한 id와 일치하는 독서기록 요청'})
  @ApiResponse({status:200, type:Record})
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Token expired' }) 
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Invalid token' }) 
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recordService.findOne(+id);
  }
  @ApiOperation({summary: '독서기록 수정'})
  @ApiResponse({status:200, type:Record})
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Token expired' }) 
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Invalid token' }) 
  @ApiUnauthorizedResponse({status:401, description: 'Unathorized: You are not the owner of this resource.' }) 
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  @UseGuards(JwtAuthGuard,OwnerAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.update(+id, updateRecordDto);
  }

  @ApiOperation({summary: '독서기록 삭제'})
  @ApiResponse({status:204})
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Token expired' }) 
  @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Invalid token' }) 
  @ApiUnauthorizedResponse({status:401, description: 'Unathorized: You are not the owner of this resource.' }) 
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  @UseGuards(JwtAuthGuard,OwnerAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    this.recordService.remove(+id);
    return 204;
  }
}

