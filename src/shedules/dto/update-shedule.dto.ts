import { PartialType } from '@nestjs/mapped-types';
import { CreateSheduleDto } from './create-shedule.dto';

export class UpdateSheduleDto extends PartialType(CreateSheduleDto) {}
