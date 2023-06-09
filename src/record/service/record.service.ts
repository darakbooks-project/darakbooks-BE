import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRecordDTO } from '../dto/create-record.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { Record } from '../record.entity';
import { MoreThan, Repository } from 'typeorm';
import { S3Service } from 'src/common/s3.service';
import { UserService } from 'src/user/service/user.service';
import { recordDTO } from '../dto/record.dto';


@Injectable()
export class RecordService {
  public recordColumns = [
    'record.recordId','record.readAt' , 'record.text', 'record.recordImg', 'record.recordImgUrl','record.tags',
    'book.bookIsbn','book.title', 'book.thumbnail', 'book.authors',
    'user.userId', 'user.nickname', 'user.profileImg'];

  constructor(
    @Inject('RECORD_REPOSITORY') private recordRepository:Repository<Record>, 
    private readonly s3Service: S3Service,
    private readonly userService : UserService){}

  async create(createDTO: recordDTO) {
    const record = this.recordRepository.create(createDTO);
    return await this.recordRepository.save(record);
  }

  async toDto(dto:recordDTO, userId:string, bookIsbn:string){
    dto.bookIsbn = bookIsbn;
    dto.userId   = userId;
    return dto;
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
    .select(this.recordColumns)
    .leftJoin('record.bookIsbn', 'book')
    .leftJoin('record.userId', 'user')
    .where('record.recordId > :lastId', { lastId })
    .orderBy('record.recordId', 'ASC')
    .limit(pageSize)
    .getMany();
    return this.transformRecords(result);
  }

  async getByLastIdAndBookId(lastId: number, pageSize: number, bookId: string): Promise<Record[]> {
    if(!lastId) lastId = 0;
    const result = await this.recordRepository
      .createQueryBuilder('record')
      .select(this.recordColumns)
      .leftJoin('record.bookIsbn', 'book')
      .leftJoin('record.userId', 'user')
      .where('record.recordId > :lastId', { lastId })
      .andWhere('record.bookIsbn = :bookId', { bookId })
      .orderBy('record.recordId', 'ASC')
      .limit(pageSize)
      .getMany();
    return this.transformRecords(result);
  }

  async getByLastIdAndUserId(ownerId:string, userId:string, lastId: number, pageSize: number): Promise<Record[]>{
    if(!lastId) lastId = 0;
    const isHidden = (await this.userService.validateUser(ownerId)).bookshelfIsHidden ;
    if(isHidden && ownerId!==userId) throw new UnauthorizedException("비공개 서재입니다.") ;

    const result = await this.recordRepository
      .createQueryBuilder('record')
      .select(this.recordColumns)
      .leftJoin('record.bookIsbn', 'book')
      .leftJoin('record.userId', 'user')
      .where('record.recordId > :lastId', { lastId }) // lastId보다 큰 ID를 가진 레코드를 필터링합니다.
      .andWhere('record.userId = :userId', { ownerId }) // 특정 사용자의 ID 값을 필터링합니다.
      .orderBy('record.recordId', 'ASC') // ID를 오름차순으로 정렬합니다.
      .limit(pageSize) // 결과를 pageSize만큼 제한합니다.
      .getMany();
      return this.transformRecords(result);
  }

  async getByLastIdAndUserIdAndBookId(ownerId:string, userId:string,bookId:string, lastId: number, pageSize: number): Promise<Record[]>{
    if(!lastId) lastId = 0;
    const isHidden = (await this.userService.validateUser(ownerId)).bookshelfIsHidden ;
    if(isHidden && ownerId!==userId) throw new UnauthorizedException("비공개 서재입니다.") ;

    const result = await this.recordRepository
      .createQueryBuilder('record')
      .select(this.recordColumns)
      .leftJoin('record.bookIsbn', 'book')
      .leftJoin('record.userId', 'user')
      .where('record.recordId > :lastId', { lastId }) // lastId보다 큰 ID를 가진 레코드를 필터링합니다.
      .andWhere('record.userId = :userId', { userId }) // 특정 userId와 일치하는 레코드를 필터링합니다.
      .andWhere('record.bookId = :bookId', { bookId }) // 특정 bookId와 일치하는 레코드를 필터링합니다.
      .orderBy('record.recordId', 'ASC') // ID를 오름차순으로 정렬합니다.
      .limit(pageSize) // 결과를 pageSize만큼 제한합니다.
      .getMany();
      return this.transformRecords(result);
  }

  async transformRecords(records){
    const transformedRecords = records.map(record => {
      return {
        recordId: record.recordId,
        text: record.text,
        recordImg: record.recordImg,
        recordImgUrl: record.recordImgUrl,
        tags: record.tags,
        readAt: record.readAt,
        book: {
          title: record.bookIsbn.title,
          thumbnail: record.bookIsbn.thumbnail,
          bookIsbn: record.bookIsbn.bookIsbn,
          authors: record.bookIsbn.authors,
        },
        user: {
          userId: record.userId.userId,
          nickname: record.userId.nickname,
          profileImg: record.userId.profileImg,
        },
      };
    });
    return transformedRecords;
  }

}
