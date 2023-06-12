import { ApiProperty } from '@nestjs/swagger';
export class accessDTO{
    @ApiProperty({ example: 'access_token', description: 'Access token' })
    accessToken: string;
}

export class userNotfoundDTO{
  @ApiProperty({ example: "NOT FOUND: USER NOT FOUND" })
    message: string;
}

export class unahtorizeddDTO{
  @ApiProperty({ example: "Unauthorized" })
    message: string;
}

export const refreshRes = {
  'Set-Cookie': {name: 'Authorization', description: 'refresh token',schema: {type: 'string',},},}

  export const refreshHeader = {
    name: 'Authorization', description: 'login시 설정되는 cookie의 refresh token' 
  }