import { GPTController } from './gpt.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GPTController],
})
export class GPTModule {}
