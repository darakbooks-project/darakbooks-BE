import { Controller, Get, Post, Body } from '@nestjs/common';
import * as https from 'https';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { gptDTO } from './dto/gpt.dto';
import { gptTwoDTO } from './dto/gpt.dto.two';
import { gptInputDTO } from './dto/gpt.input.dto';
import { BookRecommendationService } from './gpt.service';
import { BookRecommendationServiceTwo } from './gpt.service2';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

@ApiTags('gpt')
@Controller('recs')
export class GPTController {
  constructor(
    private readonly bookRecommendationService: BookRecommendationService,
    private readonly bookRecommendationServiceTwo: BookRecommendationServiceTwo,
  ) {}

  @ApiOperation({ summary: 'gpt 에게 책 추천받기' })
  @ApiBody({ type: gptInputDTO })
  @ApiResponse({ status: 201, type: gptDTO })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: error message',
  })
  @Get('recommendations')
  async getBookAPI(@Body() userInput: any): Promise<any> {
    const apiUrl = 'https://nl.go.kr/NL/search/openApi/saseoApi.do';
    const apiKey = process.env.LIBRARY_API_KEY;
    const startDate = '20000101';
    const endDate = '20230431';
    const drCode = ['11', '6', '5', '4'];

    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

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
              const recomISBN = item.recomisbn[0];
              const recomPublisher = item.recompublisher[0];
              const recomFilePath = item.recomfilepath[0];
              const recomContents = item.recomcontens[0];
              return {
                recomTitle,
                recomAuthor,
                recomISBN,
                recomPublisher,
                recomFilePath,
                recomContents,
              };
            }),
          );
        }),
      );

      //console.log(processedData);

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
  @ApiOperation({ summary: 'gpt 에게 책 추천받기' })
  @ApiBody({ type: gptInputDTO })
  @ApiResponse({ status: 201, type: gptTwoDTO })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request: error message',
  })
  @Post('recommendations/two')
  async getBookAPITwo(@Body() userInput: any): Promise<any> {
    const recs =
      await this.bookRecommendationServiceTwo.generateBookRecommendations(
        userInput,
      );
    return recs;
  }
  catch(error) {
    console.error('Error retrieving book data:', error);
    throw new Error('Failed to retrieve book data');
  }
}
