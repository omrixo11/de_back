import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { GiftCardService } from './gift-card.service';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { GiftCard } from 'src/schemas/giftCard.schema';

@Controller('gift-card')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Post()
  async create(@Body() createGiftCardDto: CreateGiftCardDto): Promise<GiftCard> {
    return this.giftCardService.create(createGiftCardDto);
  }

  @Get()
  async findAll(): Promise<GiftCard[]> {
    return this.giftCardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GiftCard> {
    return this.giftCardService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGiftCardDto: UpdateGiftCardDto): Promise<GiftCard> {
    return this.giftCardService.update(id, updateGiftCardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.giftCardService.remove(id);
  }
}
