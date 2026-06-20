import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { VisualItemsService } from './visual_items.service';
import { CreateVisualItemDto } from './dto/create-visual_item.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('visual-items')
@Controller('visual-items')
export class VisualItemsController {
  constructor(private readonly visualItemsService: VisualItemsService) {}

  @ApiResponse({ status: 201, description: 'Visual item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload or validation failed' })
  @ApiResponse({ status: 409, description: 'Visual item already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error while creating visual item' })
  @Post('create')
  create(@Body() createVisualItemDto: CreateVisualItemDto) {
    return this.visualItemsService.create(createVisualItemDto);
  }

  @ApiResponse({ status: 200, description: 'Visual item retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid search term' })
  @ApiResponse({ status: 404, description: 'Visual item not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving visual item' })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.visualItemsService.findOne(term);
  }

  @ApiResponse({ status: 200, description: 'Visual item deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id or visual item not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while deleting visual item' })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.visualItemsService.remove(id);
  }
}
