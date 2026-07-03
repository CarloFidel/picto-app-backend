import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
  imports: [TypeOrmModule.forFeature([Calendar]), AuthModule],
})
export class CalendarModule {}
