import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoostService } from './boost.service';
import { CreateBoostDto } from './dto/create-boost.dto';
import { UpdateBoostDto } from './dto/update-boost.dto';

@Controller('boost')
export class BoostController {
  constructor(private readonly boostService: BoostService) { }

}
