import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=>UserService))private userService:UserService,
        private jwtService: JwtService,
        private configService:ConfigService,
    ){}

    async login(userData: any) {
        let user = await this.validateUser(userData);
        if(!user) user = await this.createUser(userData);
        return this.setToken(userData.userId);
        // const payload = { username: user.username, sub: user.userId };
        // return {
        //   access_token: this.jwtService.sign(payload),
        // };
    }

    async validateUser(userData:any){
        return await this.userService.findByuserId(userData.userId);
    }

    async createUser(userData:any){
        const user = await this.userService.createUser(userData);
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

}
