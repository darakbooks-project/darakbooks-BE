import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecordDTO } from '../dto/create-record.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { Record } from '../record.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/common/s3.service';

@Injectable()
export class RecordService {
  constructor(@Inject('RECORD_REPOSITORY') private recordRepository:Repository<Record>, private readonly s3Service: S3Service){}

  async create(createDTO: CreateRecordDTO) {
    const record = this.recordRepository.create(createDTO);
    return await this.recordRepository.save(record);
  }

  async findOne(id: number) {
    //record 가 없을 때 notfoundexception 던지기 
    const record = await this.recordRepository.findOneBy({recordId:id});
    if(!record) throw new NotFoundException('record');
    return record;
  }

  async update(id: number, updateDTO: UpdateRecordDto) {
    const record = await this.findOne(id);
    record.update = updateDTO;
    return await this.recordRepository.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    console.log(record);
    await this.s3Service.deleteFile(record.recordImg);
    return await this.recordRepository.delete({recordId:id});
  }

  async getByLastId(lastId: number, pageSize: number): Promise<Record[]>{
    if(!lastId) lastId = 0;
    const result = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.recordId > :lastId', { lastId }) // lastId보다 큰 ID를 가진 레코드를 필터링합니다.
      .orderBy('record.recordId', 'ASC') // ID를 오름차순으로 정렬합니다.
      .limit(pageSize) // 결과를 pageSize만큼 제한합니다.
      .getMany();

    return result;
  }
  async getByLastIdAndBookId(lastId: number, pageSize: number, bookId: string): Promise<Record[]> {

    const result = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.recordId > :lastId', { lastId })
      .andWhere('record.bookIsbn = :bookId', { bookId }) // bookId가 일치하는 레코드만 필터링합니다.
      .orderBy('record.id', 'ASC')
      .limit(pageSize)
      .getMany();
  
    return result;
  }

}
