import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service'
import { User } from 'src/user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';
import { JsonWebTokenError } from 'jsonwebtoken';

const USER = 'USER'

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=>UserService))private userService:UserService,
        private jwtService: JwtService,
        private configService:ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    async login(userData) {
        let user:User = await this.userService.findByKakaoId(userData.kakaoId);
        //kakao Id 기반으로 userId 만들기 
        if(!user) {
            const userId = this.getRandomId();
            userData.userId = userId;
            user = await this.userService.create(userData);
        }
        return this.setToken(user.userId);
    }

    getRandomId(){
        let result = '';
        for (let i = 0; i < 7; i++) {
            result += Math.floor(Math.random() * 10); // 0부터 9까지의 랜덤한 숫자 선택
        }
        return String(result);
    }

    async setToken(userId:string):Promise<object>{
        const payload = {userId};
        const accessToken = await this.setAccess(payload);
        const refreshToken = await this.setRefrsh(payload);
        return {accessToken,refreshToken};
    }

    async setRefrsh(payload:any){
        const jwtToken = await this.jwtService.signAsync(payload,{
            secret:this.configService.get('jwt.jwtRefreshSecret'),
            expiresIn:`${this.configService.get('jwt.refreshExpiresInDay')}days`,
        });
        await this.cacheManager.set(payload.userId,jwtToken,this.configService.get('redis.ttls') ); //60days>ms
        return jwtToken;
    }

    async setAccess(payload:any){
        return await this.jwtService.signAsync(payload,{
            secret:this.configService.get('jwt.jwtAccessSecret'),
            expiresIn:`${this.configService.get('jwt.accessExpiresInHour')}h`,
            //expiresIn:`${this.configService.get('jwt.accessExpiresInSec')}s`,
        });
    }

    async validateRefresh(token:string){
        //올바른 secret으로 만든 refreshtoken인지 확인 
        const payload = await this.jwtService.verifyAsync(token,
            {secret:this.configService.get('jwt.jwtRefreshSecret'),});
        //cache에 저장된 refresh token인지 확인 
        const stored  = await this.cacheManager.get(payload.userId);
        if(stored===token) return {userId:payload.userId};
        else throw new JsonWebTokenError('Unauthorized: Invalid token') ;
    }

    async logout(payload:any){
        const userId = payload.userId;
        const user = await this.userService.validateUser(userId);
        //refresh token 삭제 
        this.cacheManager.del(userId);
    }
}