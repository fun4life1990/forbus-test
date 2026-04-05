import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  type LoggerService,
} from '@nestjs/common';

@Catch()
export class BaseAppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost): void | object {
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (response.headersSent) {
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return response.status(status).json({
          message: exceptionResponse,
          statusCode: status,
          timestamp: new Date().toISOString(),
        });
      }

      return response.status(status).json({
        ...exceptionResponse,
        timestamp: new Date().toISOString(),
      });
    }

    const status = exception['status'] || HttpStatus.BAD_REQUEST;
    const message = exception.message || 'Bad Request';

    response.status(status).json({
      message,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
