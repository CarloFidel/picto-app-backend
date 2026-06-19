import {
  Controller,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleItemService } from './schedule_item.service';

@Controller('schedule-item')
export class ScheduleItemController {
  constructor(private readonly scheduleItemService: ScheduleItemService) {}

  @Get('all-from-shedule/:sheduleid')
  findAll(@Param('sheduleid') sheduleid: string) {
    return this.scheduleItemService.findAll(sheduleid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleItemService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleItemService.remove(id);
  }
}
