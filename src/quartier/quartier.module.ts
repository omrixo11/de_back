import { Module } from '@nestjs/common';
import { QuartierService } from './quartier.service';
import { QuartierController } from './quartier.controller';

@Module({
  controllers: [QuartierController],
  providers: [QuartierService],
})
export class QuartierModule {}
