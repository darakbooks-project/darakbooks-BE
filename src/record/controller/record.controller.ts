import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RecordService } from '../service/record.service';
import { CreateRecordDTO } from '../dto/create-record.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { recordDTO } from '../dto/record.dto';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  async create(@Body() createDTO: recordDTO) {
    const create_record_DTO = createDTO.record;
    const book_DTO = createDTO.book;
    const record = await this.recordService.create(create_record_DTO);
    //책db에 책 저장하기 
    return record ; //post return 할 때는 그냥 tag로 string으로만 보내는데 괜찮나? 
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.recordService.remove(+id);
  }
}
