import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/roles.interfaces';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/auth.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('create')
  @Auth(ValidRoles.therapist)
  create(@Body() createArticleDto: CreateArticleDto, @GetUser() user: User) {
    return this.articlesService.create(createArticleDto, user);
  }

  @Get()
  @Auth()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':resume')
  @Auth()
  findOne(@Param('resume') resume: string) {
    return this.articlesService.findOne(resume);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
