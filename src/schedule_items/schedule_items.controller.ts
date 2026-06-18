import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleItemsService } from './schedule_items.service';
import { CreateScheduleItemDto } from './dto/create-schedule_item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule_item.dto';

@Controller('schedule-items')
export class ScheduleItemsController {
  constructor(private readonly scheduleItemsService: ScheduleItemsService) {}

  @Post()
  create(@Body() createScheduleItemDto: CreateScheduleItemDto) {
    return this.scheduleItemsService.create(createScheduleItemDto);
  }

  @Get()
  findAll() {
    return this.scheduleItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleItemDto: UpdateScheduleItemDto) {
    return this.scheduleItemsService.update(+id, updateScheduleItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleItemsService.remove(+id);
  }
}
