import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoostService } from './boost.service';
import { CreateBoostDto } from './dto/create-boost.dto';
import { UpdateBoostDto } from './dto/update-boost.dto';

@Controller('boost')
export class BoostController {
  constructor(private readonly boostService: BoostService) { }

  @Post('article/:articleId')
  async boostArticle(
    @Param('articleId') articleId: string,
    @Body() createBoostDto: CreateBoostDto
  ) {
    createBoostDto.contentId = articleId;
    return this.boostService.createBoost(createBoostDto);
  }

}
