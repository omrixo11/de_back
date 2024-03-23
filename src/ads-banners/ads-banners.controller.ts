import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AdsBannersService } from './ads-banners.service';
import { CreateAdsBannerDto } from './dto/create-ads-banner.dto';
import { UpdateAdsBannerDto } from './dto/update-ads-banner.dto';

@Controller('ads-banners')
export class AdsBannersController {
  constructor(private readonly adsBannersService: AdsBannersService) {}

  @Post()
  async create(@Body() createAdsBannerDto: CreateAdsBannerDto) {
    const newBanner = await this.adsBannersService.create(createAdsBannerDto);
    return newBanner;
  }

  @Get()
  async findAllActive() {
    return await this.adsBannersService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adsBannersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdsBannerDto: UpdateAdsBannerDto) {
    return await this.adsBannersService.update(+id, updateAdsBannerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.adsBannersService.remove(+id);
    return; 
  }
}
