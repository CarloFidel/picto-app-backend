import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { User } from '../auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
  ) {}

  async create(createCalendarDto: CreateCalendarDto, user: User) {
    const existing = await this.findOne(createCalendarDto.date, user);

    if (existing) {
      return await this.update(createCalendarDto, user);
    }

    if (
      !createCalendarDto.sheduleId ||
      createCalendarDto.sheduleId.length === 0
    ) {
      return;
    }

    try {
      const event = this.calendarRepository.create({
        ...createCalendarDto,
        user,
      });

      await this.calendarRepository.save(event);

      return {
        event,
        message: 'Horario creado correctamente',
      };
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  async findAll(user: User) {
    try {
      const events = await this.calendarRepository.find({
        where: { user: { id: user.id } },
      });

      if (events.length === 0) {
        return {
          message: 'No se encontró ningún evento',
        };
      }

      return events;
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  async findOne(date: string, user: User) {
    const event = await this.calendarRepository.findOne({
      where: { user: { id: user.id }, date },
    });
    return event;
  }

  private async update(updateCalendarDto: UpdateCalendarDto, user: User) {
    const { date, sheduleId } = updateCalendarDto;

    const existing = await this.findOne(date!, user);

    if (!existing) throw new NotFoundException('No hay eventos encontrados');

    if (!sheduleId || sheduleId.length === 0) {
      await this.calendarRepository.delete(existing.id);
      return {
        message: 'Evento eliminado con éxito',
      };
    }

    try {
      await this.calendarRepository.update(
        { id: existing.id },
        { sheduleId: sheduleId },
      );
      return {
        event: {
          id: existing.id,
          sheduleId: sheduleId,
        },
        message: 'Evento actualizado con éxito',
      };
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  async remove(id: string, user: User) {
    const exisiting = await this.calendarRepository.findOne({
      where: { user: { id: user.id }, id },
    });
    if (!exisiting) throw new NotFoundException('No se encontró ningún evento');

    await this.calendarRepository.delete(id);

    return `El evento ha sido borrado exitosamente`;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
