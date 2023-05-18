import {Inject, Controller, Post, Get, UseGuards, forwardRef, Req, Res, UseFilters } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service' ;
import { kakaoGuard } from 'src/auth/kakao/kakao-auth.guard';
import { Request , Response} from 'express';
import { JwtRefreshAuthGuard } from 'src/auth/jwt/jwt-refresh.guard';
import kakaoExceptionFilter from '../../exceptionFilter/kakao.filter';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';


@Controller('user')
export class UserController {
    constructor(@Inject(forwardRef(()=>AuthService))private authService:AuthService,) {} 

    @UseFilters(kakaoExceptionFilter)
    @Get('/auth/kakao')
    @UseGuards(kakaoGuard)
    async login(@Req() req:Request, /*@Res({ passthrough: true }) res: Response*/){
        const {accessToken,refreshToken}:any = await this.authService.login(req.user);
        // res.cookie('RefreshToken',refreshToken,{
        //     httpOnly:true,
        //     sameSite:'none' ,
        //     secure: true, //https로 backend 바꿔야 함.  
            
        // })
        return {accessToken,refreshToken};
    }

    @UseFilters(JwtExceptionFilter)
    @Get('/auth/reissu')
    @UseGuards(JwtRefreshAuthGuard)
    async reissue(@Req() req:Request){

    }

}
