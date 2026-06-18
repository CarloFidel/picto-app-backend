import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VisualItemsService } from './visual_items.service';
import { CreateVisualItemDto } from './dto/create-visual_item.dto';

@Controller('visual-items')
export class VisualItemsController {
  constructor(private readonly visualItemsService: VisualItemsService) {}

  @Post('create')
  create(@Body() createVisualItemDto: CreateVisualItemDto) {
    return this.visualItemsService.create(createVisualItemDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.visualItemsService.findOne(term);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.visualItemsService.remove(id);
  }
}
