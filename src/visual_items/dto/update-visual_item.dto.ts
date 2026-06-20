import { PartialType } from '@nestjs/mapped-types';
import { CreateVisualItemDto } from './create-visual_item.dto';

export class UpdateVisualItemDto extends PartialType(CreateVisualItemDto) {}
