import { Module } from '@nestjs/common';
import { ScheduleItemService } from './schedule_item.service';
import { ScheduleItemController } from './schedule_item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleItem } from './entities/schedule_item.entity';

@Module({
  controllers: [ScheduleItemController],
  providers: [ScheduleItemService],
  imports: [TypeOrmModule.forFeature([ScheduleItem])],
})
export class ScheduleItemModule {}
