import { KonnectService } from './konnect.service';
import { KonnectController } from './konnect.controller';
import { Module } from '@nestjs/common';


@Module({
  controllers: [KonnectController],
  providers: [KonnectService],
})
export class KonnectModule {}
