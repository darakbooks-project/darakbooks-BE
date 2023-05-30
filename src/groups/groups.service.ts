import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uploadFile } from 'src/config/s3uploads';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
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

  async getTopThreeGroups() {
    const groups = await this.groupsRepository.find({
      relations: ['userGroup'],
      order: {
        userGroup: 'DESC',
      },
      take: 3,
    });

    return groups;
  }

  async getGroupLeadById(group_id: number) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
    });

    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    if (!group.group_lead) {
      throw new NotFoundException('해당 독서모임장 정보가 존재하지 않습니다.');
    }

    return group.group_lead;
  }

  // imageFile: Express.Multer.File,
  async createGroup(body: GroupsCreateDto) {
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
    group.userGroup = body.userGroup;
    group.group_lead = body.group_lead;

    // if (!!imageFile) {
    //   const imageKey = `groups/${uuidv4()}`;
    //   const imageUrl = await uploadFile(imageFile, imageKey);
    //   group.representative_image = imageUrl;
    // }

    const createdGroup = await this.groupsRepository.save(group);

    return createdGroup;
  }

  async deleteGroup(group_id: number) {
    await this.groupsRepository.delete(group_id);
  }

  async editGroup(group_id: number, body: GroupsCreateDto) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
    });
    if (!group) {
      throw new BadRequestException('해당 독서모임은 존재하지 않습니다');
    }

    group.name = body.name;
    group.meeting_type = body.meeting_type;
    group.open_chat_link = body.open_chat_link;
    group.participant_limit = body.participant_limit;
    group.description = body.description;
    group.recruitment_status = body.recruitment_status;
    group.region = body.region;
    group.userGroup = body.userGroup;
    group.group_lead = body.group_lead;

    const editedGroup = await this.groupsRepository.save(group);
    return editedGroup;
  }

  async getAllUsersInGroup(group_id: number) {
    const group = await this.groupsRepository.find({
      where: { group_id },
      relations: ['userGroup'],
    });

    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    const users = group[0].userGroup;
    return users;
  }

  async addUserToGroup(group_id: number, userId: string) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
    });
    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }
    // 유저 아이디가 존재하는지 체크

    // authService.validateUser(userId)

    group[0].userGroup.push(userId);

    const updatedGroup = await this.groupsRepository.save(group);

    return updatedGroup;
  }

  async removeUserFromGroup(group_id: number, userId: string) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
      relations: ['userGroup'],
    });

    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }
    // 유저 아이디가 존재하는지 체크

    // authService.validateUser(userId)

    group[0].userGroup.splice(userId, 1);

    const updatedGroup = await this.groupsRepository.save(group);

    return updatedGroup;
  }
}
function group_id(group_id: any, number: any, userId: any, string: any) {
  throw new Error('Function not implemented.');
}

