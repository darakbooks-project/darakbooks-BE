import {Inject, Controller, Request, Post, Get, UseGuards, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth/auth.service' ;
import { kakaoGuard } from 'src/auth/kakao/kakao-auth.guard';
@Controller('user')
export class UserController {
    constructor(@Inject(forwardRef(()=>AuthService))private authService:AuthService,) {} 

    @Get('/kakao/auth')
    @UseGuards(kakaoGuard)
    async login(@Request() req){
        const token = await this.authService.login(req.user);
        return {
            accessToken: `Bearer ${token.accessToken}`,
            refreshToken: `Bearer ${token.refreshToken}`
        }
    }

}
