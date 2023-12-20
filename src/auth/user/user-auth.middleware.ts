// user-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, '1234567890qwertyuiop') as any;
        req.user = decoded;
      } catch (error) {
        // Token is invalid
        console.error('Invalid token:', error.message);
      }
    }

    next();
  }
}

export function authMiddleware() {
  return new AuthMiddleware().use;
}
