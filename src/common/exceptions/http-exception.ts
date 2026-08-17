import { HttpStatus } from './http-status';

export type HttpExceptionResponse =
  | string
  | {
      message?: string | string[];
      error_message?: string | object;
      error_code?: string | number;
      code?: string | number;
    };

export class HttpException extends Error {
  constructor(
    private readonly response: HttpExceptionResponse,
    private readonly status: HttpStatus,
  ) {
    super(typeof response === 'string' ? response : String(response.message ?? response.error_message ?? status));
  }

  getStatus(): HttpStatus {
    return this.status;
  }

  getResponse(): HttpExceptionResponse {
    return this.response;
  }
}

export class BadRequestException extends HttpException {
  constructor(response: HttpExceptionResponse = 'Bad request') {
    super(response, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(response: HttpExceptionResponse = 'Unauthorized') {
    super(response, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(response: HttpExceptionResponse = "Can't access this resource") {
    super(response, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(response: HttpExceptionResponse = 'Not found') {
    super(response, HttpStatus.NOT_FOUND);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(response: HttpExceptionResponse = 'Validation failed') {
    super(response, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
