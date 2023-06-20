import { Document } from 'langchain/document';
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
// import { TranslatorService } from 'nestjs-translator';
import { loadQARefineChain } from 'langchain/chains';

@Injectable()
export class BookRecommendationService {
  // constructor(private translator: TranslatorService) {}

  async generateBookRecommendations(
    bookdata: any[],
    userInput: any,
  ): Promise<any> {
    bookdata = await Promise.all(
      bookdata.map(async (book) => {
        const filteredContents = book[0].recomContents
          .replace(/<\/?[^>]+(>|$)|&nbsp;/g, ' ')
          .replace(/\s+/g, ' ');
        console.log(book[0]);
        book[0].recomContents = filteredContents;
        return new Document({
          pageContent:
            ' Title: ' +
            book[0].recomTitle +
            ' Author: ' +
            book[0].recomAuthor +
            ' ISBN: ' +
            book[0].recomISBN +
            ' Image: ' +
            book[0].recomFilePath +
            ' Intro: ' +
            book[0].recomContents,
        });
      }),
    );

    const model = new OpenAI({
      maxConcurrency: 10,
      temperature: 0,
    });
    const chainA = loadQARefineChain(model);

    // const userRequest = this.translator.translate(userInput.userInput, {
    //   lang: 'en',
    // });
    // console.log(userRequest);

    bookdata = bookdata.sort(() => Math.random() - 0.5);
    console.log(bookdata[0]);

    const resA = await chainA.call({
      input_documents: [bookdata[0]],
      question: `Why is ${bookdata[0].pageContent} good for ${userInput.userInput}? Return at least four sentences in Korean and Always finish your sentences. continue till period(.) `,
    });
    const final = resA.output_text;
    const cleanedText =
      final.replace(/\n\n/g, '').match(/.*?\.(?=[^.]*$)/)?.[0] || '';

    const pageContent = bookdata[0].pageContent;
    interface Book {
      Title: string;
      Author: string;
      ISBN: string;
      Image: string;
      Intro: string;
      Reason: string;
    }

    const book: Book = {
      Title: '',
      Author: '',
      ISBN: '',
      Image: '',
      Intro: '',
      Reason: '',
    };

    // Extracting values from the pageContent string
    const regex = /Title:\s*(.*?)\s*Author:\s*(.*?)\s*ISBN:\s*(.*?)\s*Image:\s*(.*?)\s*Intro:\s*(.*?)$/gm;
    const matches = regex.exec(pageContent);

    if (matches) {
      book.Title = matches[1];
      book.Author = matches[2];
      book.ISBN = matches[3];
      book.Image = matches[4];
      book.Intro = matches[5];
      book.Reason = cleanedText;
    }
    console.log(book);
    return book;
  }
}
