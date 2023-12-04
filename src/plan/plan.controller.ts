import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(id);
  }

  @Post(':id/add-feature')
  addFeatureToPlan(@Param('id') id: string, @Body('description') featureDescription: string) {
    return this.planService.addFeatureToPlan(id, featureDescription);
  }

  @Delete(':id/delete-feature/:featureId')
  deleteFeatureFromPlan(@Param('id') id: string, @Param('featureId') featureId: string) {
    return this.planService.deleteFeatureFromPlan(id, featureId);
  }
}
