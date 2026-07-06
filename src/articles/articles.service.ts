import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/auth.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, user: User) {
    const existing = await this.findOne(createArticleDto.resume);

    if (existing) {
      throw new BadRequestException('El artículo ya existe');
    }

    try {
      const article = this.articleRepository.create({
        ...createArticleDto,
        user,
      });

      await this.articleRepository.save(article);

      const {
        user: { password, ...userWithoutPassword },
        ...articleData
      } = article;

      return {
        ...articleData,
        user: userWithoutPassword,
      };
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  async findAll() {
    const articlesAll = await this.articleRepository.find();
    return articlesAll;
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { resume: term };

    const existing = await this.articleRepository.findOne({
      where,
    });

    return existing;
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new NotFoundException('El artículo no existe');
    }

    await this.articleRepository.delete(existing.id);

    return {
      message: 'Artículo eliminado exitosamente',
    };
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
