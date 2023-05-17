import {Inject, Controller, Post, Get, UseGuards, forwardRef, Req, Res } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service' ;
import { kakaoGuard } from 'src/auth/kakao/kakao-auth.guard';
import { Request , Response} from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
@Controller('user')
export class UserController {
    constructor(@Inject(forwardRef(()=>AuthService))private authService:AuthService,) {} 

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

    @Get('/auth/reissu')
    @UseGuards(JwtAuthGuard)
    async reissue(@Req() req:Request){

    }

}
