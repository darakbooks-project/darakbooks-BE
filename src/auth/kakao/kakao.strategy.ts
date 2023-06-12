import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { forwardRef } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';

export class kakaoStrategy extends PassportStrategy(Strategy,"kakao"){
    constructor(
        @Inject(forwardRef(()=>AuthService))private authService:AuthService
        ){
        super({
            clientID: process.env.KAKAO_CLIENT_ID,
            callbackURL: process.env.KAKAO_CALLBACK_URL,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const user= {
            userId:profile.id,
            nickname:profile.username,
            photoUrl:profile._json.properties.profile_image,
            gender:profile._json.kakao_account.gender,
            age:profile._json.kakao_account.age_range,
            provider:profile.provider,
        }
        return user;
    }
}