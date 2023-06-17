import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { GroupsCreateDto } from './dto/groups.create.dto';
import { GroupEntity } from './entities/groups.entity';
import { User } from '../user/user.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
@Injectable()
export class GroupsService {
  constructor(
    @Inject('GROUPS_REPOSITORY')
    private groupsRepository: Repository<GroupEntity>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @Inject('USER_GROUP_REPOSITORY')
    private usergroupRepository: Repository<UserGroup>,
  ) {}

  async saveGroupData(group: GroupEntity, dto: GroupsCreateDto) {
    group.name = dto.name;
    group.meeting_type = dto.meeting_type;
    group.open_chat_link = dto.open_chat_link;
    group.participant_limit = dto.participant_limit;
    group.day = dto.day;
    group.time = dto.time;
    group.description = dto.description;
    group.recruitment_status = dto.recruitment_status;
    group.region = dto.region;
    group.group_lead = dto.group_lead;
  }

  async isGroupLead(group, userId) {
    if (group.group_lead == userId) {
      return true;
    } else {
      return false;
    }
  }

  async isParticipant(group_id, userId) {
    const groupUsers = await this.getAllUsersInGroup(group_id);
    const userIds: string[] = []; // Array to store the user IDs

    for (const user of groupUsers) {
      userIds.push(user.userId);
    }

    if (userIds.includes(userId)) {
      return true;
    } else {
      return false;
    }
  }

  async findUserList(userIds: User[]) {
    for (const userId of userIds) {
      const user = await this.userRepository.findOne({
        where: { userId: userId.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `해당 ${user.userId} 정보가 존재하지 않습니다.`,
        );
      }
    }
  }

  async findUser(user_id: string) {
    const userfind = await this.userRepository.findOne({
      where: { userId: user_id },
    });

    if (!userfind) {
      throw new NotFoundException('해당 유저 정보가 존재하지 않습니다.');
    }

    return userfind;
  }

  async findAllGroups() {
    const groups = await this.groupsRepository.find();

    return groups;
  }

  async findUserGroups(userId) {
    const userGroups = await this.usergroupRepository.find({
      where: { user: { userId: userId } },
      relations: ['group'],
    });

    userGroups.forEach((userGroup: any) => {
      userGroup.group.is_group_lead = true;
      if (userGroup.group.group_lead == userId) {
        userGroup.group.is_group_lead = true;
      } else {
        userGroup.group.is_group_lead = false;
      }
      userGroup.group.is_participant = true;
    });

    const groupValues = userGroups.map((item) => {
      return item.group;
    });

    return groupValues;
  }

  async findNGroups(page: number, limit: number) {
    const skipCount = (page - 1) * limit;

    const [groups, totalGroups] = await this.groupsRepository
      .createQueryBuilder('groupsentity')
      .skip(skipCount)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalGroups / limit);

    return {
      groups,
      totalPages,
      totalGroups,
      currentPage: page,
    };
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
    const group = await this.getOneGroupById(group_id);

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
    if (isExistName) {
      throw new BadRequestException('해당 독서모임의 이름은 이미 존재 합니다.');
    }
    const group = new GroupEntity();
    this.saveGroupData(group, body);

    const createdGroup = await this.groupsRepository.save(group);

    const lastUserGroup = await this.usergroupRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });

    const grouplead = await this.userRepository.findOne({
      where: { userId: body.group_lead },
    });

    const userGroup = new UserGroup();
    userGroup.id = lastUserGroup ? lastUserGroup.id + 1 : 1;
    userGroup.user = grouplead;
    userGroup.group = group;

    await this.usergroupRepository.save(userGroup, { reload: true });

    if (body.userGroup) {
      const userIds = body.userGroup;
      await this.findUserList(userIds);

      const lastUserGroup = await this.usergroupRepository.findOne({
        where: {},
        order: { id: 'DESC' },
      });

      const userGroupEntities = userIds.map((userId) => {
        const userGroup = new UserGroup();
        userGroup.id = lastUserGroup ? lastUserGroup.id + 1 : 1;
        userGroup.user = userId;
        userGroup.group = group;
        return userGroup;
      });

      const createdGroupUser = await this.usergroupRepository.save(
        userGroupEntities,
        { reload: true },
      );
    }
    return createdGroup;
  }

  async deleteGroup(group_id: number, res: Response) {
    const groupfind = await this.getOneGroupById(group_id);
    const groupId = groupfind.group_id;

    await this.usergroupRepository.delete({ group: { group_id: groupId } });
    await this.groupsRepository.delete(group_id);

    return res.status(204).send();
  }

  async editGroup(group_id: number, body: GroupsCreateDto) {
    const group = await this.getOneGroupById(group_id);
    this.saveGroupData(group, body);
    const editedGroup = await this.groupsRepository.save(group);

    return editedGroup;
  }

  async getAllUsersInGroup(group_id: number) {
    const groupusers = await this.usergroupRepository.find({
      where: { group: { group_id: group_id } },
      relations: ['user'],
    });
    console.log(groupusers);
    const userIds = groupusers.map((userGroup) => userGroup.user);

    return userIds;
  }

  async addUserToGroup(group_id: number, user_id: string) {
    const groupfind = await this.getOneGroupById(group_id);
    const userfind = await this.findUser(user_id);
    const userGroup = new UserGroup();
    userGroup.group = groupfind;
    userGroup.user = userfind;
    const savedUserGroup = await this.usergroupRepository.save(userGroup);

    return savedUserGroup;
  }

  async removeUserFromGroup(group_id: number, user_id: string, res: Response) {
    await this.usergroupRepository.delete({
      user: { userId: user_id },
      group: { group_id: group_id },
    });

    return res.status(204).send();
  }
}
