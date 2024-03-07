import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  _id: string; 
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private userService: UserService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = jwt.verify(token, '1234567890qwertyuiop') as JwtPayloadWithUserId;
            request.user = await this.userService.findOne(decoded._id);
            if (!request.user) {
                throw new UnauthorizedException('User not found');
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
