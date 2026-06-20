import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateVisualItemDto } from './dto/create-visual_item.dto';
import { UpdateVisualItemDto } from './dto/update-visual_item.dto';
import { User } from '../auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VisualItem } from './entities/visual_item.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class VisualItemsService {
  constructor(
    @InjectRepository(VisualItem)
    private readonly visualItemRepository: Repository<VisualItem>,
  ) {}

  async create(createVisualItemDto: CreateVisualItemDto) {
    const { url } = createVisualItemDto;
    try {
      const existItem = await this.findOne(url);
      console.log(existItem);
      if (!existItem) {
        const visualItem =
          this.visualItemRepository.create(createVisualItemDto);
        const item = this.visualItemRepository.save(visualItem);

        return item;
      }
      return existItem;
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  findOne(term: string) {
    if (!isUUID(term)) {
      const item = this.visualItemRepository.findOneBy({ url: term });
      return item;
    }

    const item = this.visualItemRepository.findOneBy({ id: term });
    return item;
  }

  async remove(id: string) {
    const item = await this.findOne(id);

    if (!item) {
      throw new BadRequestException(`No item founded with id ${id}`);
    }

    const removed = await this.visualItemRepository.delete({ id });

    if (removed) {
      return {
        status: 200,
        message: 'Deleted succesfull',
      };
    }
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
