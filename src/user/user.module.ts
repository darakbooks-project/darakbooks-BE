import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.provider';
import { CacheConfigModule } from 'src/database/cache.module';
import { S3Service } from 'src/common/s3.service';
@Module({
    imports:[DatabaseModule,forwardRef(() => AuthModule),CacheConfigModule],
    providers:[...userProviders, UserService,AuthService,S3Service],
    controllers: [UserController],    
    exports : [UserService],
})
export class UserModule {}
