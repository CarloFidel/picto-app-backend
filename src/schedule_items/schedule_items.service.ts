import { Injectable } from '@nestjs/common';
import { CreateScheduleItemDto } from './dto/create-schedule_item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule_item.dto';

@Injectable()
export class ScheduleItemsService {
  create(createScheduleItemDto: CreateScheduleItemDto) {
    return 'This action adds a new scheduleItem';
  }

  findAll() {
    return `This action returns all scheduleItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleItem`;
  }

  update(id: number, updateScheduleItemDto: UpdateScheduleItemDto) {
    return `This action updates a #${id} scheduleItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleItem`;
  }
}
