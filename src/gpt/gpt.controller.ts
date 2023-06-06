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

@ApiTags('gpt_recs')
@Controller('recs')
export class GPTController {
  createEmbeddings = async ({ token, model, input }) => {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify({ input, model }),
    });
    const { error, data, usage } = await response.json();
    return data;
  };

  chatCompletions = async ({ token, body }) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response;
  };

  async generateBookRecommendations(
    bookdata: any[],
    @Body() userInput: any,
  ): Promise<any> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const bookdataClean = JSON.stringify(bookdata)
      .replace(/<[^>]+>/g, '')
      .replace(/\\/g, '')
      .replace(/"/g, '');
    const inputText = `Can you recommend 3 books for me?.`;

    const uservector = await this.createEmbeddings({
      token: process.env.OPENAI_API_KEY,
      model: 'text-embedding-ada-002',
      input: userInput.userInput,
    });

    const recommendedBooks = await Promise.all(
      bookdata.map(async (book) => {
        const input = book[0].recomContents
          .replace(/<\/?[^>]+(>|$)|&nbsp;/g, ' ')
          .replace(/\s+/g, ' ');
        const bookVector = await this.createEmbeddings({
          token: process.env.OPENAI_API_KEY,
          model: 'text-embedding-ada-002',
          input: input,
        });
        const data = await bookVector;
        return data;
      }),
    );

    // promt generation
    const template = `Give 3 book recommendations based on the UserInput using the provided Data".

    Data: {DATA}

    UserInput: {INPUT}

    Answer: `;

    const getPrompt = (context, query) => {
      return template.replace('{DATA}', context).replace('{INPUT}', query);
    };

    // Create a concatenated string from search results metadata
    const dFata = recommendedBooks
      .map((vector) => vector[0].embedding)
      .join(' ');
    console.log('context', dFata);
    // Build the complete prompt including the context and the question
    const prompt = getPrompt(dFata, userInput.userInput);

    const messages = [];
    messages.push({
      role: 'user',
      content: prompt, // This is the `prompt` we received from `getPrompt()`
    });

    try {
      console.log(messages);
      const response = await this.chatCompletions({
        token: process.env.OPENAI_API_KEY,
        body: {
          model: 'gpt-3.5-turbo',
          messages,
        },
      });
      const recommendations = await response;
      return recommendations;
      // const requestPayload: CreateCompletionRequest = {
      //   model: 'text-davinci-003',
      //   prompt: inputText,
      //   max_tokens: 100,
      //   temperature: 0.7,
      //   n: 1,
      // };

      // const response = await openai.createCompletion(requestPayload);
      // const recommendations = response.data.choices;

      // const formattedRecommendations: gptDTO[] = recommendations.map(
      //   (rec: any, index: number) => {
      //     const bookData = bookdata[index % bookdata.length]; // Retrieve book data from your dataset

      //     const formattedRec: gptDTO = {
      //       bookIsbn: `isbn-${index + 1}`,
      //       title: bookData.recomTitle,
      //       authors: [bookData.recomAuthor],
      //       publisher: bookData.recomPublisher,
      //       thumbnail: bookData.recomFilePath,
      //     };

      //     return formattedRec;
      //   },
      // );
      // return formattedRecommendations;
    } catch (error) {
      console.error('Error generating book recommendations:', error);
      throw new Error('Failed to generate book recommendations');
    }
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
