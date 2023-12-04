import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanSchema, PlanDocument } from 'src/schemas/plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanFeature, PlanFeatureDocument } from 'src/schemas/planFeature.schema';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<Plan>,
    @InjectModel(PlanFeature.name) private planFeatureModel: Model<PlanFeatureDocument>, 

    ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const createdPlan = new this.planModel(createPlanDto);
    return createdPlan.save();
  }

  async addFeatureToPlan(planId: string, featureDescription: string): Promise<PlanDocument> {
    const plan = await this.planModel.findById(planId).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with id ${planId} not found`);
    }

    const newFeature: PlanFeatureDocument = new this.planFeatureModel({ description: featureDescription });

    plan.planFeatures.push(newFeature);
    return plan.save();
  }


  async deleteFeatureFromPlan(planId: string, featureId: string): Promise<Plan> {
    const plan = await this.planModel.findById(planId).populate('planFeatures').exec();
  
    if (!plan) {
      throw new NotFoundException(`Plan with id ${planId} not found`);
    }
  
    // Find the index of the feature to be deleted
    const featureIndex = plan.planFeatures.findIndex(
      (feature) => feature._id.toString() === featureId
    );
  
    // Check if the feature exists
    if (featureIndex === -1) {
      throw new NotFoundException(`Feature with id ${featureId} not found in plan`);
    }
  
    // Remove the feature from the array
    plan.planFeatures.splice(featureIndex, 1);
  
    // Save the updated plan
    return plan.save();
  }
  

  async findAll(): Promise<Plan[]> {
    return this.planModel.find().exec();
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const updatedPlan = await this.planModel
      .findByIdAndUpdate(id, updatePlanDto, { new: true })
      .exec();
    if (!updatedPlan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return updatedPlan;
  }

  async remove(id: string): Promise<Plan> {
    const deletedPlan = await this.planModel.findByIdAndDelete(id).exec();
    if (!deletedPlan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return deletedPlan;
  }
}
