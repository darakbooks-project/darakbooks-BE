import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.provider';
import { CacheConfigModule } from 'src/database/cache.module';
@Module({
    imports:[DatabaseModule,forwardRef(() => AuthModule),],
    providers:[...userProviders, UserService,AuthService,JwtService, CacheConfigModule,],
    controllers: [UserController],    
    exports : [UserService],
})
export class UserModule {}
