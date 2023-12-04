import { Injectable } from '@nestjs/common';
import { CreateQuartierDto } from './dto/create-quartier.dto';
import { UpdateQuartierDto } from './dto/update-quartier.dto';

@Injectable()
export class QuartierService {
  create(createQuartierDto: CreateQuartierDto) {
    return 'This action adds a new quartier';
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
