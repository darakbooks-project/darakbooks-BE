import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GroupsUserGroupDto } from './dto/groups.user-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsCreateDto } from './dto/groups.create.dto';
import { ReadOnlyGroupsDto } from './dto/groups.dto';
import { GroupsService } from './groups.service';

@ApiTags('groups')
@ApiResponse({
  status: 500,
  description: '서버처리오류, 담당자 문의',
})
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @ApiOperation({ summary: '모든 그룹 조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    isArray: true,
    type: ReadOnlyGroupsDto,
  })
  @Get()
  async findAllGroups() {
    return await this.groupsService.findAllGroups();
  }

  @ApiOperation({ summary: '특정 그룹 조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    type: ReadOnlyGroupsDto,
  })
  @Get('/:group_id')
  async getOneGroupById(@Param('group_id') group_id: number) {
    return await this.groupsService.getOneGroupById(group_id);
  }

  @ApiOperation({ summary: '그룹 생성' })
  @ApiResponse({
    status: 201,
    description: '응답성공',
    type: ReadOnlyGroupsDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createGroup(
    @UploadedFile() imageFile: Express.Multer.File,
    @Body() body: GroupsCreateDto,
  ) {
    return await this.groupsService.createGroup(imageFile, body);
  }

  @ApiOperation({ summary: '그룹의 모든 user 조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    isArray: true,
    type: GroupsUserGroupDto,
  })
  @Get('/:group_id/users')
  async getAllUsersInGroup(@Param('group_id') groupId: number) {
    return await this.groupsService.getAllUsersInGroup(groupId);
  }

  @ApiOperation({ summary: '유저를 그룹에 추가' })
  @ApiResponse({
    status: 200,
    description: '유저가 그룹에 추가되었습니다.',
    type: ReadOnlyGroupsDto,
  })
  @Post('/:group_id/add-user/:user_id')
  async addUserToGroup(
    @Param('group_id') groupId: number,
    @Param('user_id') userId: string,
  ) {
    return await this.groupsService.addUserToGroup(groupId, userId);
  }

  @ApiOperation({ summary: '유저를 그룹에서 제거' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({
    status: 404,
    description: '해당 독서모임 또는 유저가 존재하지 않습니다.',
  })
  @Delete('/:group_id/delete-user/:user_id')
  async removeUserFromGroup(
    @Param('group_id') groupId: number,
    @Param('user_id') userId: string,
  ) {
    return await this.groupsService.removeUserFromGroup(groupId, userId);
  }
}
