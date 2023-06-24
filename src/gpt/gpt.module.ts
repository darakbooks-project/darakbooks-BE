import { BookRecommendationService } from './gpt.service';
import { BookRecommendationServiceTwo } from './gpt.service2';
import { GPTController } from './gpt.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GPTController],
  providers: [BookRecommendationService, BookRecommendationServiceTwo],
})
export class GPTModule {}
