import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/auth.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('create')
  @Auth()
  create(@Body() createCalendarDto: CreateCalendarDto, @GetUser() user: User) {
    return this.calendarService.create(createCalendarDto, user);
  }

  @Get('all')
  @Auth()
  findAll(@GetUser() user: User) {
    return this.calendarService.findAll(user);
  }

  @Get(':date')
  @Auth()
  findOne(@Param('date') date: string, @GetUser() user: User) {
    return this.calendarService.findOne(date, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.calendarService.remove(id, user);
  }
}
