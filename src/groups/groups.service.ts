import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Groups } from './entities/groups.entity';

@Injectable()
export class GroupsService {
  constructor(
    @Inject('GROUPS_REPOSITORY') private groupsRepository: Repository<Groups>,
  ) {}

  async test() {
    return await this.groupsRepository.find();
  }
}
