import { Module } from '@nestjs/common';
import { QuartierService } from './quartier.service';
import { QuartierController } from './quartier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quartier, QuartierSchema } from 'src/schemas/quartier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Quartier.name, schema: QuartierSchema}
    ])
  ],
  controllers: [QuartierController],
  providers: [QuartierService],
})
export class QuartierModule {}
