import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  async findAllGroups() {
    return await this.groupsService.findAllGroups();
  }

  @Get('/:group_id')
  async getOneGroupById(@Param('group_id') group_id: number) {
    return await this.groupsService.getOneGroupById(group_id);
  }
}
