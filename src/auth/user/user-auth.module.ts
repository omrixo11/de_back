// admin-auth.module.ts
import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { NodeMailerService } from 'src/utils/node.mailer';

@Module({
  imports: [UserModule, PassportModule],
  providers: [UserAuthService, NodeMailerService],
  controllers: [UserAuthController],
  exports: [UserAuthService]
})
export class UserAuthModule {}
