import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Request , Response} from 'express';
import { uploadFile } from 'src/config/s3uploads';
import { Repository, Entity } from 'typeorm';
import { GroupsCreateDto } from './dto/groups.create.dto';
import { ReadOnlyGroupsDto } from './dto/groups.dto';
import { GroupEntity } from './entities/groups.entity';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { UserGroup } from '../user-group/entities/user-group.entity';
@Injectable()
export class GroupsService {
  constructor(
    @Inject('GROUPS_REPOSITORY')
    private groupsRepository: Repository<GroupEntity>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @Inject('USER_GROUP_REPOSITORY')
    private usergroupRepository: Repository<UserGroup>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findAllGroups() {
    const groups = await this.groupsRepository.find();

    return groups;
  }

  async getUserGroup(group_id: number) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
      relations: ['userGroup'],
    });
    return group.userGroup;
  }

  async getOneGroupById(group_id: number) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
      relations: ['userGroup'],
    });

    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    return group;
  }

  async getTopGroups(count: number) {
    const groupUserCounts = await this.usergroupRepository
      .createQueryBuilder('userGroup')
      .select('userGroup.group', 'group')
      .addSelect('COUNT(userGroup.user.userId)', 'userCount')
      .innerJoinAndSelect('userGroup.group', 'group')
      .groupBy('userGroup.group')
      .orderBy('userCount', 'DESC')
      .limit(count)
      .getRawMany();

    return groupUserCounts;
  }

  async getGroupLeadById(group_id: number) {
    const group = await this.groupsRepository.findOne({
      where: { group_id },
    });

    if (!group) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    if (!group.group_lead) {
      throw new NotFoundException(
        '해당 독서모임에 모임장 정보가 존재하지 않습니다.',
      );
    }
    const groupLead = await this.userRepository.findOne({
      where: { userId: group.group_lead },
    });

    if (!groupLead) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }

    return groupLead;
  }

  async createGroup(body: GroupsCreateDto) {
    const isExistName = await this.groupsRepository.findOne({
      where: { name: body.name },
    });
    if (!!isExistName) {
      throw new BadRequestException('해당 독서모임의 이름은 이미 존재 합니다.');
    }

    const group = new GroupEntity();
    group.name = body.name;
    group.meeting_type = body.meeting_type;
    group.open_chat_link = body.open_chat_link;
    group.participant_limit = body.participant_limit;
    group.description = body.description;
    group.recruitment_status = body.recruitment_status;
    group.region = body.region;
    group.group_lead = body.group_lead;

    const createdGroup = await this.groupsRepository.save(group);

    const userIds = body.userGroup;

    userIds.map(async (userId) => {
      const user = await this.userRepository.findOne({
        where: { userId: userId.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `해당 ${user.userId} 정보가 존재하지 않습니다.`,
        );
      }
    });

    const userGroupEntities = userIds.map((userId) => {
      const userGroup = new UserGroup();
      userGroup.group = group;
      userGroup.user = userId;
      return userGroup;
    });
    const updatedGroup = await this.usergroupRepository.save(userGroupEntities);
    return createdGroup;
  }

  async deleteGroup(group_id: number, res: Response) {
    const groupfind = await this.groupsRepository.find({
      where: { group_id },
    });

    if (!groupfind) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    await this.usergroupRepository.delete({ group: groupfind });
    await this.groupsRepository.delete(group_id);

    return res.status(204).send();
  }

  // usergroup edit 추가하기
  async editGroup(group_id: number, body: ReadOnlyGroupsDto) {
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
    group.group_lead = body.group_lead;

    const editedGroup = await this.groupsRepository.save(group);
    return editedGroup;
  }

  async getAllUsersInGroup(group_id: number) {
    const groupfind = await this.groupsRepository.find({
      where: { group_id },
    });

    if (!groupfind) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    const groupusers = await this.usergroupRepository.find({
      where: { group: groupfind[0] },
      relations: ['user'],
    });
    const userIds = groupusers.map((userGroup) => userGroup.user);
    return userIds;
  }

  async addUserToGroup(group_id: number, user_id: string) {
    const groupfind = await this.groupsRepository.find({
      where: { group_id },
    });

    if (!groupfind) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }
    console.log(groupfind);

    const userfind = await this.userRepository.findOne({
      where: { userId: user_id },
    });

    const userGroup = new UserGroup();
    userGroup.group = groupfind[0];
    userGroup.user = userfind;

    const savedUserGroup = await this.usergroupRepository.save(userGroup);

    return savedUserGroup;
  }

  async removeUserFromGroup(group_id: number, user_id: string) {
    const groupfind = await this.groupsRepository.findOne({
      where: { group_id },
    });

    if (!groupfind) {
      throw new NotFoundException('해당 독서모임 정보가 존재하지 않습니다.');
    }

    const userfind = await this.userRepository.findOne({
      where: { userId: user_id },
    });

    if (!userfind) {
      throw new NotFoundException('해당 유저 정보가 존재하지 않습니다.');
    }
    const updatedGroup = await this.usergroupRepository.delete({
      user: userfind,
      group: groupfind,
    });
    return updatedGroup;
  }
}
