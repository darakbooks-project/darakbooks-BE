import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RecordService } from '../../record/service/record.service';

@Injectable()
export class OwnerAuthGuard implements CanActivate {
  constructor(
    private readonly recordService: RecordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; // 인증된 사용자의 ID

    // 요청에서 파라미터로 전달된 리소스의 ID
    const resourceId = request.params.id;

    // 리소스의 소유자 정보 조회
    const resource = await this.recordService.findOne(resourceId); // 리소스 조회 메서드에 맞게 적절한 호출 코드로 변경해야 합니다.

    // 요청된 리소스의 소유자 정보 (예시로 userId 필드 사용)
    const resourceOwnerId = resource.userId;
    // 인증된 사용자의 ID와 리소스의 소유자 ID를 비교하여 본인인증 여부를 확인합니다.
    const isOwner = userId === resourceOwnerId;
    if (!isOwner) {
      throw new UnauthorizedException('Unathorized:You are not the owner of this resource.');
    }
    return isOwner;
  }
}