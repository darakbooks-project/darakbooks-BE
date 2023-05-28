import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uploadFile } from 'src/config/s3uploads';
import { Repository } from 'typeorm';
import { GroupsCreateDto } from './dto/groups.create.dto';
import { Groups } from './entities/groups.entity';
import { v4 as uuidv4 } from 'uuid';

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

  async createGroup(imageFile: Express.Multer.File, body: GroupsCreateDto) {
    const isExistName = await this.groupsRepository.findOne({
      where: { name: body.name },
    });
    if (!!isExistName) {
      throw new BadRequestException('해당 독서모임의 이름은 이미 존재 합니다.');
    }

    const group = new Groups();
    group.name = body.name;
    group.meeting_type = body.meeting_type;
    group.open_chat_link = body.open_chat_link;
    group.participant_limit = body.participant_limit;
    group.description = body.description;
    group.recruitment_status = body.recruitment_status;
    group.region = body.region;

    if (!!imageFile) {
      const imageKey = `groups/${uuidv4()}`;
      const imageUrl = await uploadFile(imageFile, imageKey);
      group.representative_image = imageUrl;
    }

    const createdGroup = await this.groupsRepository.save(group);

    return createdGroup;
  }
}
