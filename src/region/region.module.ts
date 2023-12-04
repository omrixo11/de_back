import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Region, RegionSchema } from 'src/schemas/region.schema';
import { Ville, VilleSchema } from 'src/schemas/ville.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Region.name, schema: RegionSchema },
      { name: Ville.name, schema: VilleSchema },
    ]),],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule { }
