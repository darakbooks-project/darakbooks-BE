import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RecordService } from '../../record/service/record.service';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class GroupAuthGuard implements CanActivate {
  constructor(
    private readonly groupService: GroupsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; // 인증된 사용자의 ID

    // 요청에서 파라미터로 전달된 리소스의 ID
    const resourceId = request.params.groupId;

    // 리소스의 소유자 정보 조회(그룹장 찾는 method 연결해주세요)
    const resource = await this.groupService.getOneGroupById(resourceId);
    const resourceOwner = resource.group_lead;
    // 인증된 사용자의 ID와 리소스의 소유자 ID를 비교하여 본인인증 여부를 확인합니다.
    const isOwner = userId === resourceOwner;
    if (!isOwner) {
      throw new UnauthorizedException('Unathorized:You are not the owner of this resource.');
    }
    return isOwner;
  }
}