import { Injectable } from '@nestjs/common';
import { CreateQuartierDto } from './dto/create-quartier.dto';
import { UpdateQuartierDto } from './dto/update-quartier.dto';
import { Quartier } from 'src/schemas/quartier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuartierService {

  @InjectModel(Quartier.name) private readonly quartierModel: Model<Quartier>


  create(createQuartierDto: CreateQuartierDto) {
    return 'This action adds a new quartier';
  }

  async getQuartierSuggestions(input: string): Promise<Quartier[]> {
    // Implement logic to fetch regions based on the user's input
    const regex = new RegExp(input, 'i'); // Case-insensitive regex pattern
    return this.quartierModel.find({ name: { $regex: regex } }).exec();
  }

  findAll() {
    return `This action returns all quartier`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quartier`;
  }

  update(id: number, updateQuartierDto: UpdateQuartierDto) {
    return `This action updates a #${id} quartier`;
  }

  remove(id: number) {
    return `This action removes a #${id} quartier`;
  }
}
