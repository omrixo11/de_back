import { PartialType } from '@nestjs/mapped-types';
import { CreateKonnectDto } from './create-konnect.dto';

export class UpdateKonnectDto extends PartialType(CreateKonnectDto) {}
