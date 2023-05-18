import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'access_token', description: 'Access token' })
  accessToken: string;

  @ApiProperty({ example: 'refresh_token', description: 'Refresh token' })
  refreshToken: string;
}

export class ReissueDto{
    @ApiProperty({ example: 'access_token', description: 'Access token' })
    accessToken: string;
}