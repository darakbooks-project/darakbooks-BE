import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service'
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=>UserService))private userService:UserService,
        private jwtService: JwtService,
        private configService:ConfigService,
    ){}

    async login(userData) {
        let user:User = await this.userService.findByuserId(userData.userId);
        if(!user) user = await this.userService.createUser(userData);
        return this.setToken(user.userId);
    }

    async validateUser(userId){
        const user = await this.userService.findByuserId(userId);
        if(!user) console.log('존재하지 않는 사용자입니다. ') //존재하지 않는 유저에 대한 error 메세지 작성. 
        return user;
    }


    async setToken(userId:number):Promise<object>{
        const payload = {userId};
        const accessToken = await this.setAccess(payload);
        const refreshToken = await this.setRefrsh(payload);
        return {accessToken,refreshToken};
    }

    async setRefrsh(payload:object){
        return this.jwtService.signAsync(payload,{
            secret:this.configService.get('jwt.jwtRefreshSecret'),
            expiresIn:`${this.configService.get('jwt.refreshExpiresInDay')}days`,
        });
    }

    async setAccess(payload:object){
        return this.jwtService.signAsync(payload,{
            secret:this.configService.get('jwt.jwtAccessSecret'),
            expiresIn:`${this.configService.get('jwt.accessExpiresInHour')}h`,
        });
    }

    async validateRefresh(userId:number){
        const user = await this.validateUser(userId);
        if(!user.refresh) console.log('refresh 토큰 만료');
    }

}
