import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSheduleDto } from './dto/create-shedule.dto';
import { UpdateSheduleDto } from './dto/update-shedule.dto';
import { DataSource, Repository } from 'typeorm';
import { Shedule } from './entities/shedule.entity';
import { ScheduleItem } from '../schedule_item/entities/schedule_item.entity';
import { VisualItem } from '../visual_items/entities/visual_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/auth.entity';
import { validate as isUUID } from 'uuid';
import { SaveAllDto } from './dto/save-all-shedule.dto';

@Injectable()
export class ShedulesService {
  constructor(
    @InjectRepository(Shedule)
    private readonly sheuleRepository: Repository<Shedule>,
    private readonly dataSource: DataSource,
  ) {}

  async createFull(saveAllDto: SaveAllDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const title = saveAllDto.title.toLowerCase().trim();
    const existing = await this.findOneBy(title, user);

    if (existing) {
      throw new BadRequestException(
        `The title ${saveAllDto.title} is currently in use`,
      );
    }

    try {
      const schedule = queryRunner.manager.create(Shedule, {
        title: saveAllDto.title,
        user,
      });
      await queryRunner.manager.save(schedule);

      const createdItems: ScheduleItem[] = [];

      for (const itemDto of saveAllDto.items) {
        const visualItem = queryRunner.manager.create(VisualItem, {
          ...itemDto.visualitem,
          shedule: schedule,
        });
        await queryRunner.manager.save(visualItem);

        const scheduleItem = queryRunner.manager.create(ScheduleItem, {
          position: itemDto.position,
          schedule,
          visualItem,
        });
        await queryRunner.manager.save(scheduleItem);

        createdItems.push(scheduleItem);
      }

      await queryRunner.commitTransaction();

      return {
        schedule,
        //items: createdItems,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findOneBy(term: string, user: User) {
    const where = isUUID(term)
      ? { id: term, user: { id: user.id } }
      : { title: term, user: { id: user.id } };

    const shedule = await this.sheuleRepository.findOne({
      where,
      relations: { user: true, scheduleItems: { visualItem: true } },
    });

    //NOTA: Tiene que devolver undefined si no encuentra shedule para poder
    //utilizarlo en create y otros sitios. Si tuviera una respuesta, serñia imposible de reutilizar

    return shedule;
  }

  async findAllByUser(user: User) {
    const schedule = await this.sheuleRepository.find({
      where: { user: { id: user.id } },
      relations: { user: true },
    });

    return schedule;
  }

  async update(id: string, updateSheduleDto: UpdateSheduleDto, user: User) {
    const schedule = await this.findOneBy(id, user);
    if (!schedule) throw new NotFoundException('Schedule not found');

    const newTitle = updateSheduleDto.title?.toLowerCase().trim();

    if (newTitle === schedule.title) {
      return schedule;
    }

    const exist = await this.findOneBy(newTitle!, user);
    if (exist) {
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

    await this.sheuleRepository.delete(schedule.id);

    return {
      status: 'ok',
      message: `The schedule ${schedule.title} has been removed succesfully`,
    };
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
