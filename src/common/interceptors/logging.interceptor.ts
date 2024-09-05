import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, body } = request;

    // Create an array to capture the response body
    const chunks: Buffer[] = [];
    const originalSend = response.send.bind(response);

    // Override response.send to capture chunks
    response.send = (chunk: any) => {
      if (chunk !== undefined) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      // Call the original send function
      return originalSend(chunk);
    };

    // Log request details
    this.logger.log(
      `Incoming Request: ${method} ${url} ${JSON.stringify(this.sanitizeRequestBody(body))}`,
    );

    return next.handle().pipe(
      tap(() => {
        response.on('finish', () => {
          const responseBody = Buffer.concat(chunks).toString();
          this.logger.log(
            `Response:  ${method} ${url} ${response.statusCode} ${responseBody}`,
          );
        });
      }),
    );
  }

  sanitizeRequestBody(body: any): any {
    if (!body) {
      return body;
    }
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]'; // Optionally replace password with a placeholder
    }
    return sanitizedBody;
  }
}
