import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VilleService } from './ville.service';
import { CreateVilleDto } from './dto/create-ville.dto';
import { UpdateVilleDto } from './dto/update-ville.dto';

@Controller('ville')
export class VilleController {
  constructor(private readonly villeService: VilleService) { }

  @Post()
  async create(@Body() createVilleDto: CreateVilleDto) {
    return this.villeService.create(createVilleDto);
  }

  @Post(':villeId/quartiers')
  async addQuartierToVille(@Param('villeId') villeId: string, @Body() quartierDto: any) {
    return this.villeService.addQuartierToVille(villeId, quartierDto);
  }

  @Delete(':villeId/quartiers/:quartierId')
  async deleteQuartierFromVille(@Param('villeId') villeId: string, @Param('quartierId') quartierId: string) {
    return this.villeService.deleteQuartierFromVille(villeId, quartierId);
  }

  @Get('suggestions')
  async getVilleSuggestions(@Query('input') input: string) {
    return this.villeService.getVilleSuggestions(input);
  }

  @Get(':villeId/quartiers')
  async getQuartierByVille(@Param('villeId') villeId: string) {
    return this.villeService.getQuartierByVille(villeId);
  }

  @Get()
  async findAll() {
    return this.villeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.villeService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVilleDto: UpdateVilleDto) {
    return this.villeService.update(id, updateVilleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.villeService.remove(id);
  }
}
