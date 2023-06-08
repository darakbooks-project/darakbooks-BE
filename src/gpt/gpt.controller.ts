import { Controller, Get, Body } from '@nestjs/common';
import * as https from 'https';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { gptDTO } from './dto/gpt.dto';
import { BookRecommendationService } from './gpt.service';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
@Controller('recs')
export class GPTController {
  constructor(
    private readonly bookRecommendationService: BookRecommendationService,
  ) {}

  @ApiOperation({ summary: '추천받기' })
  @ApiResponse({ status: 201, type: gptDTO })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: error message',
  })
  @Get('recommendations')
  async getBookAPI(@Body() userInput: any): Promise<any> {
    const apiUrl = 'https://nl.go.kr/NL/search/openApi/saseoApi.do';
    const apiKey = process.env.LIBRARY_API_KEY;
    const startRowNumApi = 1;
    const endRowNumApi = 100;
    const startDate = '19400101';
    const endDate = '20230431';
    const drCode = '11,6,5,4';

    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      const response = await axios.get(apiUrl, {
        httpsAgent: agent,
        params: {
          key: apiKey,
          startRowNumApi: startRowNumApi,
          endRowNumApi: endRowNumApi,
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
              const recomeISBN = item.recomISBN[0];
              const recomPublisher = item.recompublisher[0];
              const recomFilePath = item.recomfilepath[0];
              const recomContents = item.recomcontens[0];
              return {
                recomTitle,
                recomAuthor,
                recomeISBN,
                recomPublisher,
                recomFilePath,
                recomContents,
              };
            }),
          );
        }),
      );

      const recommendations =
        await this.bookRecommendationService.generateBookRecommendations(
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
