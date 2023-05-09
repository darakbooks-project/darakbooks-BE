import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports:[forwardRef(() => AuthModule),],
    providers:[UserService],
    exports : [UserService],
    controllers: [UserController],
})
export class UserModule {}
