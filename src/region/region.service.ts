import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from 'src/schemas/region.schema';
import { Ville } from 'src/schemas/ville.schema';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region.name) private readonly regionModel: Model<Region>,
    @InjectModel(Ville.name) private readonly villeModel: Model<Ville>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const createdRegion = new this.regionModel(createRegionDto);
    return createdRegion.save();
  }

  async addVilleToRegion(regionId: string, villeDto: any): Promise<Region> {
    const region = await this.regionModel.findById(regionId).exec();
    if (!region) {
      throw new NotFoundException(`Region with id ${regionId} not found`);
    }

    const ville = new this.villeModel(villeDto);
    await ville.save();

    region.villes.push(ville);
    await region.save();

    return region;
  }

  async deleteVilleFromRegion(regionId: string, villeId: string): Promise<Region> {
    const region = await this.regionModel.findById(regionId).exec();
    if (!region) {
      throw new NotFoundException(`Region with id ${regionId} not found`);
    }

    const ville = await this.villeModel.findById(villeId).exec();
    if (!ville) {
      throw new NotFoundException(`Ville with id ${villeId} not found`);
    }

    region.villes = region.villes.filter((v) => v._id.toString() !== villeId);
    await region.save();

    await this.villeModel.findByIdAndDelete(villeId).exec();

    return region;
  }
  
  async findAll(): Promise<Region[]> {
    return this.regionModel.find().exec();
  }

  async findOne(id: string): Promise<Region> {
    const region = await this.regionModel.findById(id).exec();
    if (!region) {
      throw new NotFoundException(`Region with id ${id} not found`);
    }
    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto): Promise<Region> {
    const updatedRegion = await this.regionModel.findByIdAndUpdate(id, updateRegionDto, { new: true }).exec();
    if (!updatedRegion) {
      throw new NotFoundException(`Region with id ${id} not found`);
    }
    return updatedRegion;
  }

  async remove(id: string): Promise<Region> {
    const deletedRegion = await this.regionModel.findByIdAndDelete(id).exec();
    if (!deletedRegion) {
      throw new NotFoundException(`Region with id ${id} not found`);
    }
    return deletedRegion;
  }
}
