import * as https from 'https';

import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import { Controller, Get } from '@nestjs/common';

import axios from 'axios';
import { parseStringPromise } from 'xml2js';

@Controller('recs')
export class GPTController {
  @Get('recommendations')
  async getBookRecommendations(): Promise<any> {
    const apiUrl = 'https://nl.go.kr/NL/search/openApi/saseoApi.do';
    const apiKey = process.env.LIBRARY_API_KEY;
    const startDate = '20000101';
    const endDate = '20230431';
    const drCode = 11;
    // 분류번호(11:문학, 6:인문과학, 5:사회과학, 4:자연과학)

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    console.log(apiKey);

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
      console.log(response);

      const xmlData = response.data;
      // Parse XML data into JSON
      const jsonData = await parseStringPromise(xmlData);

      // Extract the list of items
      // const items = jsonData.channel.list[0].item;
      const lists = jsonData.channel.list;

      // Process each item
      const processedData = await Promise.all(
        lists.map(async (list) => {
          const items = list.item;
          return Promise.all(
            items.map(async (item) => {
              const recomTitle = item.recomtitle[0];
              const recomAuthor = item.recomauthor[0];
              const recomPublisher = item.recompublisher[0];
              const recomCallNo = item.recomcallno[0];
              const recomFilePath = item.recomfilepath[0];
              const recommokcha = item.recommokcha[0];
              const recomContents = item.recomcontens[0];
              const publishYear = item.publishYear[0];
              const recomYear = item.recomYear[0];
              const recomMonth = item.recomMonth[0];
              const mokchFilePath = item.mokchFilePath[0];
              return {
                recomTitle,
                recomAuthor,
                recomPublisher,
                recomCallNo,
                recomFilePath,
                recommokcha,
                recomContents,
                publishYear,
                recomYear,
                recomMonth,
                mokchFilePath,
              };
            }),
          );
        }),
      );

      // Generate book recommendations based on the processed data
      const recommendations = await this.generateBookRecommendations(
        processedData,
      );

      return recommendations;
    } catch (error) {
      console.error('Error retrieving book data:', error);
      throw new Error('Failed to retrieve book data');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateBookRecommendations(data: any[]): Promise<any> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const userPreferences = [
      'I am sad',
      'I am looking for a book to cheer me up during my vacation',
    ];

    const inputText = userPreferences.join('. ');

    try {
      const requestPayload: CreateCompletionRequest = {
        model: 'text-davinci-003',
        prompt: inputText,
        max_tokens: 100,
        temperature: 0.7,
        n: 1, //output 갯수
      };

      const response = await openai.createCompletion(requestPayload);
      const recommendations = response.data.choices;
      console.log(recommendations);

      // Return the book recommendations
      return recommendations;
    } catch (error) {
      console.error('Error generating book recommendations:', error);
      throw new Error('Failed to generate book recommendations');
    }
  }
}
