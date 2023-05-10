import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
@Module({
    imports:[forwardRef(() => AuthModule),TypeOrmModule.forFeature([User])],
    providers:[UserService],
    exports : [UserService],
    controllers: [UserController],
})
export class UserModule {}
