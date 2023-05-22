import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GroupsCreateDto } from './dto/groups.create.dto';
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

  async createGroup(body: GroupsCreateDto) {
    const group = new Groups();
    group.name = body.name;
    group.meeting_type = body.meeting_type;
    group.open_chat_link = body.open_chat_link;
    group.participant_limit = body.participant_limit;
    group.description = body.description;
    group.recruitment_status = body.recruitment_status;
    group.region = body.region;
    group.representative_image = body.representative_image;

    const createdGroup = await this.groupsRepository.save(group);

    return createdGroup;
  }
}
