import type { JwtPayload } from './src/core/auth';

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}

export {};
