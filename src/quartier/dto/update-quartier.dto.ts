import { PartialType } from '@nestjs/mapped-types';
import { CreateQuartierDto } from './create-quartier.dto';

export class UpdateQuartierDto extends PartialType(CreateQuartierDto) {}
