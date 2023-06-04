import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Catch(JsonWebTokenError, TokenExpiredError,NotFoundException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.UNAUTHORIZED;
    let message = 'Unauthorized';

    if (exception instanceof TokenExpiredError) {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = 'Unauthorized: Token expired';
    } else if (exception instanceof JsonWebTokenError) {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = 'Unauthorized: Invalid token';
    } else if (exception instanceof NotFoundException){
        statusCode = HttpStatus.UNAUTHORIZED;
        message = 'Unauthorized: Refresh Token deleted';
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
    throw exception;
  }
}

export default JwtExceptionFilter;