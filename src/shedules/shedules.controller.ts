import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { CreateSheduleDto } from './dto/create-shedule.dto';
import { UpdateSheduleDto } from './dto/update-shedule.dto';

@Controller('shedules')
export class ShedulesController {
  constructor(private readonly shedulesService: ShedulesService) {}

  @Post()
  create(@Body() createSheduleDto: CreateSheduleDto) {
    return this.shedulesService.create(createSheduleDto);
  }

  @Get()
  findAll() {
    return this.shedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shedulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSheduleDto: UpdateSheduleDto) {
    return this.shedulesService.update(+id, updateSheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shedulesService.remove(+id);
  }
}
