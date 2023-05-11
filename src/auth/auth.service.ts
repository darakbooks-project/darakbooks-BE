import { Inject, Injectable, forwardRef } from '@nestjs/common';
//import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { create } from 'domain';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=>UserService))private userService:UserService,
        //private jwtService: JwtServiceNP

    ){}

    async login(userData: any) {
        const user = await this.validateUser(userData);
        // const payload = { username: user.username, sub: user.userId };
        // return {
        //   access_token: this.jwtService.sign(payload),
        // };
    }

    async validateUser(userData:any){
        const user = await this.userService.findByuserId(userData.userId);
        return user;
    }

    async createUser(userData){
        const user = await this.userService.createUser(userData);
    }
}
