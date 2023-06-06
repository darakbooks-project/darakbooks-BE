import * as https from 'https';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import axios from 'axios';
import { gptDTO } from './dto/gpt.dto';
import { parseStringPromise } from 'xml2js';
import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import { loadQAStuffChain, loadQAMapReduceChain, loadQARefineChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { RefineDocumentsChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
// API CHAIN:  https://js.langchain.com/docs/modules/chains/other_chains/api_chain
// CONSTITUTIONAL CHAIN : https://js.langchain.com/docs/modules/chains/other_chains/constitutional_chain
// INPUT MODERATION CHAIN: https://js.langchain.com/docs/modules/chains/other_chains/moderation_chain
// RETRIEVAL QA : https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa
// DOCUMENT QA: https://js.langchain.com/docs/modules/chains/index_related_chains/document_qa

@ApiTags('gpt_recs_test')
@Controller('recs_test')
export class GPTController {
  async generateBookRecommendations(
    bookdata: any[],
    @Body() userInput: any,
  ): Promise<any> {
    const model = new OpenAI({ maxConcurrency: 10, temperature: 0 });
    const chainA = loadQARefineChain(model);

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
            ' Book Intro: ' +
            book[0].recomContents +
            ' Book Image: ' +
            book[0].recomFilePath,
        });
      }),
    );

    console.log(bookdata);

    const resA = await chainA.call({
      input_documents: bookdata,
      question:
        userInput.userInput +
        'in Korean from the inputDocument. Return 3 recommendations in this format: Book Title: , Author: , Book Image: ',
    });
    console.log('CALL', resA.output_text);
    // const cleanedText = resA.output_text.replace(/\n/g, '');

    // Split the text by commas to separate the fields
    // const entries = cleanedText.split(',');

    // Format entries into JSON objects
    // const books = entries.map((entry) => {
    //   const bookInfo = entry.split(' - ');
    //   const title = bookInfo[0].trim();
    //   const author = bookInfo[1].trim();
    //   const link = bookInfo[2].trim();

    //   return {
    //     bookTitle: title,
    //     author: author,
    //     link: link,
    //   };
    // });

    // Convert the array of books into a JSON string
    // const jsonOutput = JSON.stringify(books);

    // console.log(jsonOutput);

    return resA.output_text;
  }

  @ApiOperation({ summary: '추천받기' })
  @ApiResponse({ status: 201, type: gptDTO })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: error emssage',
  })
  @Get('recommendations')
  async getBookAPI(@Body() userInput: any): Promise<any> {
    const apiUrl = 'https://nl.go.kr/NL/search/openApi/saseoApi.do';
    const apiKey = process.env.LIBRARY_API_KEY;
    const startDate = '19700101';
    const endDate = '20230431';
    const drCode = 11;
    // 분류번호(11:문학, 6:인문과학, 5:사회과학, 4:자연과학)

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      const response = await axios.get(apiUrl, {
        httpsAgent: agent,
        params: {
          key: apiKey,
          start_date: startDate,
          end_date: endDate,
          drCode: drCode,
        },
      });

      const xmlData = response.data;
      const jsonData = await parseStringPromise(xmlData);
      const lists = jsonData.channel.list;

      const processedData = await Promise.all(
        lists.map(async (list) => {
          const items = list.item;
          return Promise.all(
            items.map(async (item) => {
              const recomTitle = item.recomtitle[0];
              const recomAuthor = item.recomauthor[0];
              const recomPublisher = item.recompublisher[0];
              const recomFilePath = item.recomfilepath[0];
              const recomContents = item.recomcontens[0];
              return {
                recomTitle,
                recomAuthor,
                recomPublisher,
                recomFilePath,
                recomContents,
              };
            }),
          );
        }),
      );
      const recommendations = await this.generateBookRecommendations(
        processedData,
        userInput,
      );

      return recommendations;
    } catch (error) {
      console.error('Error retrieving book data:', error);
      throw new Error('Failed to retrieve book data');
    }
  }
}
