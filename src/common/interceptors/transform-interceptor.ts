import type { NextFunction, Request, Response } from 'express';

interface TransformResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

const isTransformedResponse = (body: unknown): body is TransformResponse<unknown> => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  return 'success' in body && 'data' in body && 'timestamp' in body;
};

export const transformInterceptor = (_req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json.bind(res);

  res.json = <T>(body: T): Response => {
    if (isTransformedResponse(body)) {
      return originalJson(body);
    }

    return originalJson({
      success: true,
      data: body,
      timestamp: new Date().toISOString(),
    });
  };

  next();
};
