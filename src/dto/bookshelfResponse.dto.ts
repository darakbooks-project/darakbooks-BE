import { ApiProperty } from '@nestjs/swagger';
import { BookDTO } from 'src/bookshelf/book.dto';
import { User } from 'src/user/user.entity';

export class bookshelfNotfoundDTO{
    @ApiProperty({ example: "사용자의 책장에 저장 돼 있지 않은 책입니다."})
    message: string;
}
export class bookshelfForbiddenDTO{
    @ApiProperty({ example: "책의 독서기록이 작성 돼 있기 때문에 삭제가 안됩니다."})
    message: string;
}

export class bookshelfUserDTO{
    @ApiProperty({example:"242089420843", description:"userId"})
    userId : string;
    @ApiProperty({example:"뽀로로또", description:"user nickname"})
    nickname:string;
}
export class bookshelfResDTO{
    @ApiProperty({ description: "책장 추천: 추천 사용자의 책장에 담겨 있는 책 3권으로 이루어진 배열"})
    bookshelves:BookDTO;
    @ApiProperty()
    users:bookshelfUserDTO;

}


export class forbiddenDTO{
    @ApiProperty({ example: "이미 책장에 저장된 책입니다." })
      message: string;
  }
  