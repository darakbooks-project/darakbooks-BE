import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupsCreateDto } from './dto/groups.create.dto';
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

  @Post()
  async createGroup(@Body() body: GroupsCreateDto) {
    return await this.groupsService.createGroup(body);
  }
}
