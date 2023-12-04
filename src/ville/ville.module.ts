import { Module } from '@nestjs/common';
import { VilleService } from './ville.service';
import { VilleController } from './ville.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ville, VilleSchema } from 'src/schemas/ville.schema';
import { Quartier, QuartierSchema } from 'src/schemas/quartier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ville.name, schema: VilleSchema },
      { name: Quartier.name, schema: QuartierSchema },
    ]),],
  controllers: [VilleController],
  providers: [VilleService],
})
export class VilleModule { }
