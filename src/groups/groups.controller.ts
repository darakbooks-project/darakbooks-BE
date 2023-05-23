import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsCreateDto } from './dto/groups.create.dto';
import { ReadOnlyGroupsDto } from './dto/groups.dto';
import { GroupsService } from './groups.service';

@ApiTags('그룹정보')
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
    status: 200,
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
}
