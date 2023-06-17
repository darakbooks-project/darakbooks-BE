import { BookRecommendationService } from './gpt.service';
import { GPTController } from './gpt.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GPTController],
  providers: [BookRecommendationService],
})
export class GPTModule {}
