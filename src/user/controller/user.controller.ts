import {Inject, Controller, Post, Get, UseGuards, forwardRef, Req, Res, UseFilters, Query, Param, UseInterceptors, UploadedFile, Patch, Body } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service' ;
import { kakaoGuard } from 'src/auth/kakao/kakao-auth.guard';
import { Request , Response} from 'express';
import kakaoExceptionFilter from '../../exceptionFilter/kakao.filter';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { accessDTO, refreshHeader, refreshRes, unahtorizeddDTO, userNotfoundDTO } from 'src/dto/LoginResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UserService } from '../service/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfound.filter';
import { S3Service } from 'src/common/s3.service';
import { UpdateUserDTO } from 'src/dto/updateUserDTO';
import { FileResDTO, FileUploadDto, internalErrorDTO } from 'src/dto/RecordResponse.dto';
import { profileResDTO } from 'src/dto/profileResponse.dto';
@Controller('user')
export class UserController {
    constructor(
        @Inject(forwardRef(()=>AuthService))private authService:AuthService,
        private readonly userService:UserService,
        private readonly s3Service: S3Service,
    ) {}
    
    @ApiBearerAuth() 
    @ApiTags('Authentication')
    @ApiOperation({summary: 'kakao로 소셜 로그인(회원가입)'})
    @ApiResponse({status:200,  description: '로그인 성공',type: accessDTO, headers:refreshRes,})
    @ApiBadRequestResponse({status:400, description:'Bad Request: error emssage'})
    @UseFilters(kakaoExceptionFilter)
    @Get('/auth/kakao')
    @UseGuards(kakaoGuard)
    async login(@Query('code') code: string, @Req() req:Request, @Res({ passthrough: true }) res: Response){
        const {accessToken,refreshToken}:any = await this.authService.login(req.user);
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            sameSite:'none' ,
            domain:'mafiawithbooks.site',
            path:'/',
            secure: false, 
        });
        res.send({accessToken});
    }
    
    @ApiBearerAuth() 
    @ApiTags('Authentication')
    @ApiOperation({summary: 'access token 만료시 refresh token을 이용해 재발급'})
    @ApiHeader(refreshHeader)
    @ApiResponse({status:200, type: accessDTO})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @UseFilters(JwtExceptionFilter)
    @Get('/auth/reissu')
    async reissue(@Req() req:Request){
        const refreshToken = req.cookies.refreshToken;
        const payload       = await this.authService.validateRefresh(refreshToken);
        const accessToken = await this.authService.setAccess(payload);
        return {accessToken};
    }
    
    @ApiBearerAuth() 
    @ApiTags('Authentication')
    @ApiOperation({summary: 'logout'})
    @ApiResponse({status:204})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @Get('/auth/logout')
    @UseFilters(JwtExceptionFilter,)
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req:Request,@Res() res: Response){
        const userId  = req.user as JwtPayload;
        await this.authService.logout(userId) ;
        res.status(204).send();
    }

    //my 프로필 요청
    @ApiBearerAuth() 
    @ApiTags('my page')
    @ApiOperation({
        summary: '사용자 자신의 프로필을 요청할 때 사용', 
        description:"자신의 마이서재페이지의 프로필을 렌더링하는데 필요한 data 요청"})
    @ApiResponse({status:200, type:profileResDTO})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    @UseFilters(JwtExceptionFilter,NotFoundExceptionFilter)
    async getMyProfile(@Req() req: Request){
        const {userId} =  req.user as JwtPayload;
        //자기 자신의 프로필 불러오기
        const profile = await this.userService.getProfile(userId);
        return this.userService.toDTO(profile,true);
    }

    //다른 유저의 프로필 보기
    @ApiBearerAuth() 
    @ApiTags('my page')
    @ApiOperation({
    summary: '자신의 프로필이 아닌 타인의 프로필을 요청할 때 사용 ', 
    description:"타인의 프로필, 책장을 클릭했을 때 마이서재페이지의 프로필을 렌더링하는데 필요한 data 요청"})
    @ApiResponse({status:200, type:profileResDTO})
    @ApiParam({ name: 'ownerId', type: 'string' , description:'보고 싶은 profile 주인의 id'})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @Get('/profile/:ownerId')
    @UseFilters(JwtExceptionFilter,NotFoundExceptionFilter)
    @UseGuards(JwtAuthGuard)
    async getOtherProfile(
        @Param('ownerId') ownerId: string,
        @Req() req: Request
    ){
        const {userId} =  req.user as JwtPayload;
        const profile = await this.userService.getProfile(ownerId);
        return this.userService.toDTO(profile,false);
    }

    @ApiBearerAuth()
    @ApiTags('my page')
    @ApiOperation({summary: 'profile 사진 등록'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({type:FileUploadDto, description:'사진 파일'})
    @ApiResponse({status:201,type:FileResDTO, })
    @ApiInternalServerErrorResponse({type:internalErrorDTO,description:'file업로드 실패 '})
    @Post('/photo')
    @UseInterceptors(FileInterceptor('file'))
    @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
    async uploadFile(@UploadedFile() file: Express.Multer.File){
        const result = await this.s3Service.uploadFile(file);
        return result;
    }

    @ApiBearerAuth() 
    @ApiTags('my page')
    @ApiOperation({summary: '프로필 수정(수정하고 싶은 data만 전달하면 됨.)'})
    @ApiResponse({status:200, type:profileResDTO})
    @ApiBody({type:UpdateUserDTO})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @UseGuards(JwtAuthGuard)
    @Patch('/profile')
    @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
    async update(
        @Body() updateDto: UpdateUserDTO,
        @Req() req: Request,
    ): Promise<any> {
        const {userId} =  req.user as JwtPayload;
        return await this.userService.update(userId,updateDto)
    }

}
