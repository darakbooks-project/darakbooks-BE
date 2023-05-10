import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DatabaseModule } from 'src/database/database.module';
@Module({
    imports:[forwardRef(() => AuthModule),TypeOrmModule.forFeature([UserEntity])],
    providers:[UserService],
    exports : [UserService],
    controllers: [UserController],
})
export class UserModule {}
