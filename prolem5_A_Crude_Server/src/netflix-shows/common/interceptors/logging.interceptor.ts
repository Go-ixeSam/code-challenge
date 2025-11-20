import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, query, params, body } = req;

    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: (value) => {
          const duration = Date.now() - started;

          this.logger.log(
            `${method} ${url} | query=${JSON.stringify(
              query,
            )} | params=${JSON.stringify(params)} | body=${JSON.stringify(
              body,
            )} | +${duration}ms`,
          );
        },
        error: (err) => {
          const duration = Date.now() - started;

          this.logger.error(
            `${method} ${url} ERROR: ${err.message} | +${duration}ms`,
          );
        },
      }),
    );
  }
}
