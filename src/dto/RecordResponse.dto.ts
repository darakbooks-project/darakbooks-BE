import { ApiProperty } from '@nestjs/swagger';
import { BookDTO } from 'src/bookshelf/book.dto';
export class accessDTO{
    @ApiProperty({ example: 'access_token', description: 'Access token' })
    accessToken: string;
}

export class internalErrorDTO{
  @ApiProperty({ example: "Server ERROR: File upload failed", })
    message: string;
}

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

export class FileResDTO{
    @ApiProperty({ type: 'string', example:"1685876995200_52" ,description:'사진 파일 이름(KEY 값)' })
    photoId:string;
    @ApiProperty({ type: 'string', example:'https://darak-book-bucket.s3.ap-northeast-2.amazonaws.com/1685876995200_52' , description:'사진 파일 이름(KEY 값)' })
    photoUrl:string;
}

export class unahtorizedRecordDTO{
    @ApiProperty({ example: "Unathorized: You are not the owner of this resource.", })
      message: string;
  }

export class recordNotfoundDTO{
    @ApiProperty({ example: "NOT FOUND: RECORD NOT FOUND" })
      message: string;
  }

export class recordUserDTO{
  @ApiProperty({ example: 12934829348 , description: 'userId' }) 
  userId: string;

  @ApiProperty({
    example: '민아',
    description: '카카오 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'profile_img path',
    description: '프로필 사진',
  })
  photoUrl: string;
}

export class TransformedRecordDTO {
  @ApiProperty({ example: 1 , description: 'record_id' })   
  recordId: number;
  @ApiProperty({ example: '다음권이 너무 궁금하다. ', description: '독서 기록 글' })
  text: string;
  @ApiProperty({ example: "https://avostorage.s3.amazonaws.com/1684897517164_86", description: '독서기록 사진 url' })
  recordImgUrl: string;
  @ApiProperty({ example: [{"id": 1, "data": "tag1"}, {"id": 2, "data": "tag2"}, {"id": 3, "data": "tag3"}], description: 'tags' })
  tags: { id: number, data: string }[] ;
  @ApiProperty({ example: '2023-05-21T00:00:00.000Z', description: '책 읽은 날짜' })
  readAt: Date;
  @ApiProperty({ description: 'Book information' })
  book: BookDTO;
  @ApiProperty({ description: 'Record information' })
  user: recordUserDTO;
};
