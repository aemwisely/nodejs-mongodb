import { randomUUID } from 'crypto';
import type { ErrorRequestHandler, Request } from 'express';

import { HttpException } from './http-exception';
import { HttpStatus } from './http-status';

const version = '1.0.0';

const errorMessageMap: Record<number, string> = {
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.BAD_REQUEST]: 'Bad request',
  [HttpStatus.FORBIDDEN]: "Can't access this resource",
  [HttpStatus.NOT_FOUND]: 'Not found',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Validation failed',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
};

const getEventName = (request: Request): string =>
  `${request.method.toLowerCase()}_${request.url.split('?')[0].replace(/\//g, '_')}`;

const getExceptionStatus = (exception: unknown): HttpStatus => {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  if (exception && typeof exception === 'object' && 'statusCode' in exception) {
    const statusCode = Number((exception as { statusCode: unknown }).statusCode);
    return Number.isInteger(statusCode) ? statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  if (exception && typeof exception === 'object' && 'status' in exception) {
    const status = Number((exception as { status: unknown }).status);
    return Number.isInteger(status) ? status : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};

const getExceptionPayload = (
  exception: unknown,
  status: number,
): {
  logMessage: string | object;
  userMessage: string;
  errorCode: string | number;
} => {
  let logMessage: string | object = 'Unexpected error';
  let errorCode: string | number = '000000';

  if (exception instanceof HttpException) {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      logMessage = exceptionResponse;
    } else {
      logMessage = exceptionResponse.error_message ?? exceptionResponse.message ?? exceptionResponse;
      errorCode = exceptionResponse.error_code ?? exceptionResponse.code ?? errorCode;
    }
  } else if (exception instanceof Error) {
    logMessage = exception.message;
  } else if (exception && typeof exception === 'object') {
    const error = exception as Record<string, unknown>;
    logMessage = (error.error_message as string | object | undefined) ?? (error.message as string | undefined) ?? error;
    errorCode = (error.error_code as string | number | undefined) ?? (error.code as string | number | undefined) ?? errorCode;
  }

  const userMessage =
    errorMessageMap[status] ??
    (typeof logMessage === 'string' && !logMessage.startsWith('[') ? logMessage : 'Something went wrong');

  return {
    logMessage,
    userMessage,
    errorCode,
  };
};

export const allExceptionsFilter: ErrorRequestHandler = (exception, request, response, _next): void => {
  const status = getExceptionStatus(exception);
  const requestId = randomUUID();
  const { logMessage, userMessage, errorCode } = getExceptionPayload(exception, status);

  const logPayload = {
    timestampz: new Date().toISOString(),
    req_id: requestId,
    version,
    event: getEventName(request),
    data: {
      path: request.url,
      method: request.method,
      statusCode: status,
      error_code: errorCode,
      error_message: logMessage,
    },
  };

  console.error(JSON.stringify(logPayload, null, 2));

  response.status(status).json({
    success: false,
    req_id: requestId,
    error_code: errorCode,
    error_message: userMessage,
    timestamp: new Date().toISOString(),
  });
};
