import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVilleDto } from './dto/create-ville.dto';
import { UpdateVilleDto } from './dto/update-ville.dto';
import { Ville } from 'src/schemas/ville.schema';
import { Quartier } from 'src/schemas/quartier.schema';

@Injectable()
export class VilleService {
  constructor(
    @InjectModel(Ville.name) private readonly villeModel: Model<Ville>,
    @InjectModel(Quartier.name) private readonly quartierModel: Model<Quartier>,
  ) {}

  async create(createVilleDto: CreateVilleDto): Promise<Ville> {
    const createdVille = new this.villeModel(createVilleDto);
    return createdVille.save();
  }

  async getQuartierByVille(villeId: string): Promise<Quartier[]> {
    const ville = await this.villeModel.findById(villeId).populate('quartiers').exec();
    if (!ville) {
      throw new NotFoundException(`Region with id ${villeId} not found`);
    }
  
    return ville.quartiers;
  }

  async addQuartierToVille(villeId: string, quartierDto: any): Promise<Ville> {
    const ville = await this.villeModel.findById(villeId).exec();
    if (!ville) {
      throw new NotFoundException(`Ville with id ${villeId} not found`);
    }

    const quartier = new this.quartierModel(quartierDto);
    await quartier.save();

    ville.quartiers.push(quartier);
    await ville.save();

    return ville;
  }

  async deleteQuartierFromVille(villeId: string, quartierId: string): Promise<Ville> {
    const ville = await this.villeModel.findById(villeId).exec();
    if (!ville) {
      throw new NotFoundException(`Ville with id ${villeId} not found`);
    }

    const quartier = await this.quartierModel.findById(quartierId).exec();
    if (!quartier) {
      throw new NotFoundException(`Quartier with id ${quartierId} not found`);
    }

    ville.quartiers = ville.quartiers.filter((q) => q._id.toString() !== quartierId);
    await ville.save();

    await this.quartierModel.findByIdAndDelete(quartierId).exec();

    return ville;
  }

  async findAll(): Promise<Ville[]> {
    return this.villeModel.find().exec();
  }

  async findOne(id: string): Promise<Ville> {
    const ville = await this.villeModel.findById(id).exec();
    if (!ville) {
      throw new NotFoundException(`Ville with id ${id} not found`);
    }
    return ville;
  }

  async update(id: string, updateVilleDto: UpdateVilleDto): Promise<Ville> {
    const updatedVille = await this.villeModel.findByIdAndUpdate(id, updateVilleDto, { new: true }).exec();
    if (!updatedVille) {
      throw new NotFoundException(`Ville with id ${id} not found`);
    }
    return updatedVille;
  }

  async remove(id: string): Promise<Ville> {
    const deletedVille = await this.villeModel.findByIdAndDelete(id).exec();
    if (!deletedVille) {
      throw new NotFoundException(`Ville with id ${id} not found`);
    }
    return deletedVille;
  }
}
