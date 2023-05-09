import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
