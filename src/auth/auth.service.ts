import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service'
import { User } from 'src/user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';

interface JwtPayload {
    userId: string;
  }
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
        let user:User = await this.userService.findByuserId(userData.userId);
        if(!user) user = await this.userService.createUser(userData);
        return this.setToken(user.userId);
    }

    async validateUser(userId){
        const user = await this.userService.findByuserId(userId);
        if(!user) throw new NotFoundException(USER) 
        return user;
    }


    async setToken(userId:string):Promise<object>{
        const payload = {userId};
        const accessToken = await this.setAccess(payload);
        const refreshToken = await this.setRefrsh(payload);
        return {accessToken,refreshToken};
    }

    async setRefrsh(payload:JwtPayload){
        const jwtToken = await this.jwtService.signAsync(payload,{
            secret:this.configService.get('jwt.jwtRefreshSecret'),
            expiresIn:`${this.configService.get('jwt.refreshExpiresInDay')}days`,
        });
        await this.cacheManager.set(payload.userId, jwtToken);

        this.userService.setRefresh(payload.userId);
        return jwtToken;
    }

    async setAccess(payload:JwtPayload){
        return await this.jwtService.signAsync(payload,{
            secret:this.configService.get('jwt.jwtAccessSecret'),
            //expiresIn:`${this.configService.get('jwt.accessExpiresInHour')}h`,
            expiresIn:`${this.configService.get('jwt.accessExpiresInSec')}s`
        });
    }

    async validateRefresh(userId:string){
        //올바른 사용자인지 확인 
        const user = await this.validateUser(userId);
        //사용자의 refresh 토큰 validate 
        if(!(user.refresh)) throw new NotFoundException();
    }

    async logout(payload:JwtPayload){
        const user = await this.validateUser(payload.userId);
        //refresh token 삭제 
        user.refresh = false;
    }

}
