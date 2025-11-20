import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // 1. HTTP Exception (Nest default)
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();

            return response.status(status).json({
                success: false,
                statusCode: status,
                message: this.getHttpMessage(res),
                timestamp: new Date().toISOString(),
            });
        }

        // 2. Validation errors (class-validator)
        if (this.isClassValidatorError(exception)) {
            const messages = this.formatValidationErrors(exception);

            return response.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: messages,
                timestamp: new Date().toISOString(),
            });
        }

        // 3. TypeORM error (query, relation, constraint error)
        if (this.isTypeOrmError(exception)) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: exception.message,
                timestamp: new Date().toISOString(),
            });
        }

        // 4. Unknown error (fallback)
        console.error('[Unknown Exception]', exception);

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }

    private getHttpMessage(res: any) {
        if (typeof res === 'string') return res;
        if (res.message) return res.message;
        return 'Error';
    }

    private formatValidationErrors(exception: any): string[] {
        if (Array.isArray(exception)) {
            return exception.map((error: ValidationError) => {
                if (error.constraints) {
                    return Object.values(error.constraints).join(', ');
                }
                return 'Validation error';
            });
        }
        return ['Validation error'];
    }

    private isTypeOrmError(exception: any): boolean {
        // Basic check for TypeORM errors (customize as needed)
        return (
            exception &&
            typeof exception === 'object' &&
            (
                exception.name === 'QueryFailedError' ||
                exception.name === 'EntityNotFoundError' ||
                exception.name === 'CannotCreateEntityIdMapError'
            )
        );
    }

    private isClassValidatorError(exception: any): boolean {
        // Checks if the exception is an array of ValidationError objects
        return (
            Array.isArray(exception) &&
            exception.length > 0 &&
            exception[0] instanceof ValidationError
        );
    }
}
