import { Document } from 'langchain/document';
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { TranslatorService } from 'nestjs-translator';
import { loadQARefineChain } from 'langchain/chains';

@Injectable()
export class BookRecommendationService {
  constructor(private translator: TranslatorService) {}

  async generateBookRecommendations(
    bookdata: any[],
    userInput: any,
  ): Promise<any> {
    bookdata = await Promise.all(
      bookdata.map(async (book) => {
        const filteredContents = book[0].recomContents
          .replace(/<\/?[^>]+(>|$)|&nbsp;/g, ' ')
          .replace(/\s+/g, ' ');
        book[0].recomContents = filteredContents;
        return new Document({
          pageContent:
            ' Title: ' +
            book[0].recomTitle +
            ' Author: ' +
            book[0].recomAuthor +
            ' ISBN: ' +
            book[0].recomISBN +
            ' Book Intro: ' +
            book[0].recomContents +
            ' Book Image: ' +
            book[0].recomFilePath,
        });
      }),
    );
    console.log(bookdata);

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      Title: 'Title: of the recommendation',
      Author: 'Author: of the recommendation',
      ISBN: 'ISBN: of the recommendation',
      Image: 'Book Image: of the recommendation',
      Reason: 'Why you recommended the book',
    });

    const formatInstructions = parser.getFormatInstructions();

    const model = new OpenAI({ maxConcurrency: 10, temperature: 1 });
    const chainA = loadQARefineChain(model);

    const userRequest = this.translator.translate(userInput.userInput, {
      lang: 'en',
    });
    console.log(userRequest);

    const resA = await chainA.call({
      input_documents: bookdata,
      question:
        userRequest +
        `. Recommend 3 books in Korean from the input_documents in this format: ${formatInstructions} `,
    });
    console.log('CALL', resA.output_text);
    return resA.output_text;
  }
}
