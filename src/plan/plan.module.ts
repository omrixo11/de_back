import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanFeature, PlanFeatureSchema } from 'src/schemas/planFeature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: PlanFeature.name, schema: PlanFeatureSchema },
    ]),],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule { }
