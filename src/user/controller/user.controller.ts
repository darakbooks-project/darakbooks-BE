import {Inject, Controller, Post, Get, UseGuards, forwardRef, Req, Res, UseFilters, Query } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service' ;
import { kakaoGuard } from 'src/auth/kakao/kakao-auth.guard';
import { Request , Response} from 'express';
import { JwtRefreshAuthGuard } from 'src/auth/jwt/jwt-refresh.guard';
import kakaoExceptionFilter from '../../exceptionFilter/kakao.filter';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfoud.filter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiHeader, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto, ReissueDto } from 'src/dto/LoginResponseDTO';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
interface JwtPayload {
    userId: string;
  }


@Controller('user')
export class UserController {
    constructor(@Inject(forwardRef(()=>AuthService))private authService:AuthService,) {} 
    @ApiTags('Authentication')
    @ApiOperation({summary: 'kakao로 소셜 로그인'})
    @ApiResponse({status:200, type: LoginResponseDto})
    @ApiNotFoundResponse({status:404, description:'NOT FOUND: USER NOT FOUND'})
    @ApiBadRequestResponse({status:400, description:'Bad Request: error emssage'})
    @UseFilters(kakaoExceptionFilter,NotFoundExceptionFilter)
    @Get('/auth/kakao')
    @UseGuards(kakaoGuard)
    async login(@Query('Code') code: string, @Req() req:Request, /*@Res({ passthrough: true }) res: Response*/): Promise<{ accessToken: any; refreshToken: any; }>{
        const {accessToken,refreshToken}:any = await this.authService.login(req.user);
        // res.cookie('RefreshToken',refreshToken,{
        //     httpOnly:true,
        //     sameSite:'none' ,
        //     secure: true, //https로 backend 바꿔야 함.  
            
        // })
        return {accessToken,refreshToken};
    }
    @ApiTags('Authentication')
    @ApiOperation({summary: 'access token 만료시 refresh token을 이용해 재발급'})
    @ApiHeader({ name: 'Authorization', description: 'Bearer {refresh_token}' })
    @ApiResponse({status:200, type: ReissueDto})
    @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Token expired' }) 
    @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Invalid token' }) 
    @ApiUnauthorizedResponse({status:401, description:'Unauthorized: Refresh Token deleted' }) 
    @UseFilters(kakaoExceptionFilter,JwtExceptionFilter,NotFoundExceptionFilter)
    @Get('/auth/reissu')
    async reissue(@Req() req:Request){
        const refreshToken = req.cookies.refreshToken;
        const userId       = await this.authService.validateRefresh(refreshToken);
        const accessToken = await this.authService.setAccess(userId);
        return accessToken;
    }
    @ApiTags('Authentication')
    @ApiOperation({summary: 'logout'})
    @ApiResponse({status:204})
    @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Token expired' }) 
    @ApiUnauthorizedResponse({status:401, description: 'Unauthorized: Invalid token' }) 
    @Get('/auth/logout')
    @UseFilters(JwtExceptionFilter,NotFoundExceptionFilter,)
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req:Request){
        const userId  = req.user as JwtPayload;
        await this.authService.logout(userId) ;
        return 204;
    }

}
