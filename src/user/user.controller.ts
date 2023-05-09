import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { AuthService } from '../auth/auth.service' ;
@Controller('user')
export class UserController {
    constructor(private authService: AuthService) {} 

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

}
