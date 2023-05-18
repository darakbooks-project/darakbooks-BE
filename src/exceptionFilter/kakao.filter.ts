import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { TokenError } from 'passport-oauth2';

@Catch(TokenError)
export class kakaoExceptionFilter implements ExceptionFilter {
  catch(exception: TokenError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Bad Request: ${exception.message}`
    });
  }
}

export default kakaoExceptionFilter;