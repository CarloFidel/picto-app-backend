import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScheduleItem } from './entities/schedule_item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScheduleItemService {
  constructor(
    @InjectRepository(ScheduleItem)
    private readonly scheduleItemRepository: Repository<ScheduleItem>,
  ) {}

  async findAll(sheduleid: string) {
    const scheduleItem = await this.scheduleItemRepository.find({
      where: { schedule: { id: sheduleid } },
      relations: { schedule: true },
    });

    if (scheduleItem.length === 0) {
      throw new NotFoundException(`no schedule-item with id ${sheduleid}`);
    }

    return scheduleItem;
  }

  async findOne(id: string) {
    const scheduleItem = await this.scheduleItemRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!scheduleItem) {
      throw new NotFoundException(`ScheduleItem with id ${id} not found`);
    }

    return scheduleItem;
  }

  async remove(id: string) {
    const result = await this.scheduleItemRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ScheduleItem with id ${id} not found`);
    }

    return {
      status: 'ok',
      message: `ScheduleItem ${id} removed successfully`,
    };
  }
}
