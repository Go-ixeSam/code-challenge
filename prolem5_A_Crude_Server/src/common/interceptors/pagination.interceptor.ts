import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type PaginatedResult<T = any> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        // If result looks like paginated shape, transform into standard envelope
        if (
          result &&
          typeof result === 'object' &&
          'data' in result &&
          'total' in result &&
          'page' in result &&
          'limit' in result
        ) {
          const { data, total, page, limit } = result as PaginatedResult;
          const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
          const meta = {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          };

          return {
            status: 'success',
            meta,
            data,
          };
        }

        // Otherwise return as-is
        return result;
      }),
    );
  }
}
