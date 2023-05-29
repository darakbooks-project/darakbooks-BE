import { Module } from '@nestjs/common';
import { RecordService } from './service/record.service';
import { RecordController } from './controller/record.controller';
import { recordProviders } from './record.provider';
import { DatabaseModule } from 'src/database/database.module';
import { S3Service } from 'src/common/s3.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RecordController],
  providers: [...recordProviders,RecordService,S3Service]
})
export class RecordModule {}
