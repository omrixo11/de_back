import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuartierService } from './quartier.service';
import { CreateQuartierDto } from './dto/create-quartier.dto';
import { UpdateQuartierDto } from './dto/update-quartier.dto';

@Controller('quartier')
export class QuartierController {
  constructor(private readonly quartierService: QuartierService) {}

  @Post()
  create(@Body() createQuartierDto: CreateQuartierDto) {
    return this.quartierService.create(createQuartierDto);
  }

  @Get()
  findAll() {
    return this.quartierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quartierService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuartierDto: UpdateQuartierDto) {
    return this.quartierService.update(+id, updateQuartierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quartierService.remove(+id);
  }
}
