import { ApiProperty } from '@nestjs/swagger';
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
    recordImg:string;
    @ApiProperty({ type: 'string', example:'https://darak-book-bucket.s3.ap-northeast-2.amazonaws.com/1685876995200_52' , description:'사진 파일 이름(KEY 값)' })
    recordImgUrl:string;
}

export class unahtorizedRecordDTO{
    @ApiProperty({ example: "Unathorized: You are not the owner of this resource.", })
      message: string;
  }

  export class recordNotfoundDTO{
    @ApiProperty({ example: "NOT FOUND: RECORD NOT FOUND" })
      message: string;
  }