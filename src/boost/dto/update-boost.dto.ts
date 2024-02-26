import { PartialType } from '@nestjs/mapped-types';
import { CreateBoostDto } from './create-boost.dto';

export class UpdateBoostDto extends PartialType(CreateBoostDto) {}
