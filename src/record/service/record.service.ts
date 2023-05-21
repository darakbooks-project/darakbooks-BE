import { Inject, Injectable } from '@nestjs/common';
import { CreateRecordDTO } from '../dto/create-record.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { Record } from '../record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(@Inject('RECORD_REPOSITORY') private recordRepository:Repository<Record>){}

  async create(createDTO: CreateRecordDTO) {
    const record = this.recordRepository.create(createDTO);
    return await this.recordRepository.save(record);
  }

  async findOne(id: number) {
    //record 가 없을 때 notfoundexception 던지기 
    return await this.recordRepository.findOneBy({recordId:id});
  }

  async update(id: number, updateDTO: UpdateRecordDto) {
    const record = await this.findOne(id);
    record.update = updateDTO;
    return await this.recordRepository.save(record);
  }

  async remove(id: number) {
    return await this.recordRepository.delete({recordId:id});
  }

  async getRecordsByLastId(lastId: number, pageSize: number): Promise<Record[]>{
    const result = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.recordId > :lastId', { lastId }) // lastId보다 큰 ID를 가진 레코드를 필터링합니다.
      .orderBy('record.recordId', 'ASC') // ID를 오름차순으로 정렬합니다.
      .limit(pageSize) // 결과를 pageSize만큼 제한합니다.
      .getMany();

    return result;
  }
  async getRecordsByLastIdAndBookId(lastId: number, pageSize: number, bookId: string): Promise<Record[]> {
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
