import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  Res,
  Req,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { GroupsMetaDto } from './dto/groups.meta.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsCreateDto } from './dto/groups.create.dto';
import { ReadOnlyGroupsDto } from './dto/groups.dto';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GroupAuthGuard } from 'src/auth/owner/group-auth.guard';
import { GroupsUserGroupDto } from './dto/groups.user-group.dto';

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
  @UseGuards(JwtAuthGuard)
  async findAllGroups(@Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return await this.groupsService.findAllGroups(userId);
  }

  @ApiOperation({ summary: '요청보내는 유저가 속한 모든 그룹 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({
    status: 404,
    description: '해당 유저가 존재하지 않습니다.',
    type: ReadOnlyGroupsDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/user-group')
  async findUserGroup(@Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return await this.groupsService.findUserGroups(userId);
  }

  @ApiOperation({ summary: '유저가 속한 모든 그룹 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({
    status: 404,
    description: '해당 유저가 존재하지 않습니다.',
    type: ReadOnlyGroupsDto,
  })
  @Get('/user-group/:userId')
  async findOneUserGroup(@Param('userId') userId: string) {
    console.log('here', userId);
    return await this.groupsService.findUserGroups(userId);
  }

  @ApiOperation({ summary: '그룹 n개 조회 - pagination' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    isArray: true,
    type: GroupsMetaDto,
  })
  @Get('/find')
  async findNGroups(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const { groups, totalGroups } = await this.groupsService.findNGroups(
      page,
      limit,
    );
    const totalPages = Math.ceil(totalGroups / limit);
    const currentPage = +page;
    return {
      groups,
      totalPages,
      totalGroups,
      currentPage,
    };
  }

  @ApiOperation({ summary: '특정 그룹 조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    type: ReadOnlyGroupsDto,
  })
  @Get('/:group_id')
  @UseGuards(JwtAuthGuard)
  async getOneGroupById(
    @Param('group_id') group_id: number,
    @Req() req: Request,
  ) {
    const { userId } = req.user as JwtPayload;
    const group = await this.groupsService.getOneGroupById(group_id);
    const is_group_lead = await this.groupsService.isGroupLead(group, userId);
    const is_participant = await this.groupsService.isParticipant(
      group_id,
      userId,
    );
    group.is_group_lead = is_group_lead;
    group.is_participant = is_participant;
    return {
      group,
    };
  }

  @ApiOperation({ summary: 'user 수 가장 많은 top n개 그룹조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    type: ReadOnlyGroupsDto,
  })
  @Get('/top/:count')
  async getTopGroups(@Param('count') count: number) {
    return await this.groupsService.getTopGroups(count);
  }

  @ApiOperation({ summary: '특정 그룹의 그룹장 조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    type: ReadOnlyGroupsDto,
  })
  @Get('/:group_id/group_lead')
  async getGroupLeadById(@Param('group_id') group_id: number) {
    return await this.groupsService.getGroupLeadById(group_id);
  }

  @ApiOperation({ summary: '그룹 생성' })
  @ApiResponse({
    status: 201,
    description: '응답성공',
    type: GroupsCreateDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() body: GroupsCreateDto, @Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    if (!body.group_lead) {
      body.group_lead = userId;
    }
    return await this.groupsService.createGroup(body);
  }

  @ApiOperation({ summary: '그룹 삭제' })
  @ApiResponse({
    status: 200,
    description: '삭제 성공',
  })
  @UseGuards(JwtAuthGuard, GroupAuthGuard)
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: number, @Res() res: Response) {
    await this.groupsService.deleteGroup(groupId, res);
    return res.sendStatus(204);
  }

  @ApiOperation({ summary: '그룹 수정' })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
  })
  @UseGuards(JwtAuthGuard, GroupAuthGuard)
  @Patch(':groupId')
  async editGroup(
    @Param('groupId') groupId: number,
    @Body() body: ReadOnlyGroupsDto,
  ) {
    return await this.groupsService.editGroup(groupId, body);
  }

  @ApiOperation({ summary: '그룹의 모든 user 조회' })
  @ApiResponse({
    status: 200,
    description: '응답성공',
    isArray: true,
    type: ReadOnlyGroupsDto,
  })
  @Get('/:group_id/users')
  async getAllUsersInGroup(@Param('group_id') groupId: number) {
    return await this.groupsService.getAllUsersInGroup(groupId);
  }

  @ApiOperation({ summary: '그룹장이 유저를 그룹에 추가' })
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

  @ApiOperation({ summary: '그룹장이 유저를 그룹에서 제거' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({
    status: 404,
    description: '해당 독서모임 또는 유저가 존재하지 않습니다.',
  })
  @UseGuards(JwtAuthGuard, GroupAuthGuard)
  @Delete('/:groupId/delete-user/:user_id')
  async removeUserFromGroup(
    @Param('groupId') groupId: number,
    @Param('user_id') userId: string,
    @Res() res: Response,
  ) {
    return await this.groupsService.removeUserFromGroup(groupId, userId, res);
  }

  @ApiOperation({ summary: '유저가 그룹에 참여하기' })
  @ApiResponse({
    status: 200,
    description: '유저가 그룹에 추가되었습니다.',
    type: ReadOnlyGroupsDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('user/:group_id/join')
  async UserjoinGroup(@Param('group_id') groupId: number, @Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return await this.groupsService.addUserToGroup(groupId, userId);
  }

  @ApiOperation({ summary: '유저가 그룹에 탈퇴하기' })
  @ApiResponse({
    status: 200,
    description: '유저가 그룹에 추가되었습니다.',
    type: ReadOnlyGroupsDto,
  })
  @Post('user/:group_id/leave')
  @UseGuards(JwtAuthGuard)
  async UserleaveGroup(
    @Param('group_id') groupId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { userId } = req.user as JwtPayload;
    return await this.groupsService.removeUserFromGroup(groupId, userId, res);
  }
}
