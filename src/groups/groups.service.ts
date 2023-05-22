import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Groups } from './entities/groups.entity';

@Injectable()
export class GroupsService {
  constructor(
    @Inject('GROUPS_REPOSITORY') private groupsRepository: Repository<Groups>,
  ) {}

  async findAllGroups() {
    const groups = await this.groupsRepository.find();

    return groups;
  }

  async getOneGroupById(group_id: number) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
    });

    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    return group;
  }
}
