import type { NextFunction, Request, Response } from 'express';

interface TransformResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

const isTransformedResponse = (data: unknown): data is TransformResponse<unknown> => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  return 'success' in data && 'data' in data && 'timestamp' in data;
};

export const transformInterceptor = (_req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json.bind(res);

  res.json = <T>(data: T): Response => {
    if (isTransformedResponse(data)) {
      return originalJson(data);
    }

    return originalJson({
      success: true,
      ...data,
      timestamp: new Date().toISOString(),
    });
  };

  next();
};
