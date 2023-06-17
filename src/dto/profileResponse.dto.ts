import { ApiProperty } from '@nestjs/swagger';

export class profileResDTO{
    @ApiProperty()
    userId: string;
  
    @ApiProperty()
    nickname: string;
  
    @ApiProperty()
    photoUrl: string;
  
    @ApiProperty()
    userInfo: string;
  
    @ApiProperty()
    bookshelfIsHidden: boolean;
  
    @ApiProperty()
    isMine: boolean;
}