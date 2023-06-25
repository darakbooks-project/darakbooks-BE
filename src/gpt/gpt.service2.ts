import { Book } from 'src/entities/book.entity';
import { Document } from 'langchain/document';
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
// import { TranslatorService } from 'nestjs-translator';
import { loadQARefineChain } from 'langchain/chains';

@Injectable()
export class BookRecommendationServiceTwo {
  async generateBookRecommendations(userInput: any): Promise<any> {
    const model = new OpenAI({
      maxConcurrency: 10,
      temperature: 0,
      maxTokens: 2000,
    });

    const format = {
      title: 'Book title',
      reason: 'Reason for Recommendation',
    };

    const resA = await model.call(
      `What could be a good book for a user who is ${userInput.userInput}?
       Return the title and reason. Return at least four sentences in Korean for the reason and always finish your sentences.
        continue till period(.)
        
        Return the output in this json format : ${format}`,
    );
    const final = resA;
    console.log('final', final);

    return final;
  }
}
