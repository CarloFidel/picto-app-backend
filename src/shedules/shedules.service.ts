import { Injectable } from '@nestjs/common';
import { CreateSheduleDto } from './dto/create-shedule.dto';
import { UpdateSheduleDto } from './dto/update-shedule.dto';

@Injectable()
export class ShedulesService {
  create(createSheduleDto: CreateSheduleDto) {
    return 'This action adds a new shedule';
  }

  findAll() {
    return `This action returns all shedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shedule`;
  }

  update(id: number, updateSheduleDto: UpdateSheduleDto) {
    return `This action updates a #${id} shedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} shedule`;
  }
}
