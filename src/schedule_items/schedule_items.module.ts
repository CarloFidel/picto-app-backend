import { Module } from '@nestjs/common';
import { ScheduleItemsService } from './schedule_items.service';
import { ScheduleItemsController } from './schedule_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleItem } from './entities/schedule_item.entity';

@Module({
  controllers: [ScheduleItemsController],
  providers: [ScheduleItemsService],
  imports: [TypeOrmModule.forFeature([ScheduleItem])],
})
export class ScheduleItemsModule {}
