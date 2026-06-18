import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSheduleDto } from './dto/create-shedule.dto';
import { UpdateSheduleDto } from './dto/update-shedule.dto';
import { Repository } from 'typeorm';
import { Shedule } from './entities/shedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/auth.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ShedulesService {
  
  constructor(
    @InjectRepository(Shedule)
    private readonly sheuleRepository: Repository<Shedule>,
  ) {}

  async create(createSheduleDto: CreateSheduleDto, user: User) {
    const { title } = createSheduleDto;

    const shedule = await this.findOneBy(title, user);

    if (shedule) {
      throw new BadRequestException(`The title ${title} is currently in use`);
    }

    if (!shedule) {
      try {
        const shedule = this.sheuleRepository.create({
          ...createSheduleDto,
          user,
        });

        await this.sheuleRepository.save(shedule);

        return shedule;
      } catch (error) {}
    }
  }

  async findOneBy(term: string, user: User) {
    const where = isUUID(term)
      ? { id: term }
      : { title: term, user: { id: user.id } };

    const shedule = await this.sheuleRepository.findOne({
      where,
      relations: { user: true },
    });

    //NOTA: Tiene que devolver undefined si no encuentra shedule para poder
    //utilizarlo en create y otros sitios. Si tuviera una respuesta, serñia imposible de reutilizar

    return shedule;
  }

  async findAllByUser(userId: string, user: User) {
    const schedule = await this.sheuleRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    console.log(schedule);

    return schedule;
  }

  async update(id: string, updateSheduleDto: UpdateSheduleDto, user: User) {
    const schedule = await this.findOneBy(id, user);
    if (!schedule) throw new NotFoundException('Schedule not found');

    const newTitle = updateSheduleDto.title?.toLowerCase().trim();

    if (schedule.title === newTitle) {
      throw new BadRequestException(`The title ${newTitle} is curently in use`);
    }

    const update = await this.sheuleRepository.update(
      { id },
      { title: newTitle },
    );

    const { title, ...schedulData } = schedule;

    return { ...schedulData, title: newTitle };
  }

  async remove(id: string, user: User) {
    const schedule = await this.findOneBy(id, user);
    if (!schedule) throw new NotFoundException('Schedule not found');

    this.sheuleRepository.delete({ id });

    return {
      status: 'ok',
      message: `The schedule ${schedule.title} has been removed succesfully`,
    };
  }
}
