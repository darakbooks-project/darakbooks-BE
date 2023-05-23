import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const message = `NOT FOUND: ${exception.message} NOT FOUND`;
    response.status(404).json({ message });
  }
}

export default NotFoundException;