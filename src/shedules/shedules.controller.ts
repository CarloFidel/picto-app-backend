import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { CreateSheduleDto } from './dto/create-shedule.dto';
import { UpdateSheduleDto } from './dto/update-shedule.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/auth.entity';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('shedules')
export class ShedulesController {
  constructor(private readonly shedulesService: ShedulesService) {}

  @Post('create')
  @Auth()
  create(@Body() createSheduleDto: CreateSheduleDto, @GetUser() user: User) {
    return this.shedulesService.create(createSheduleDto, user);
  }

  @Get(':term') //por id o por title
  @Auth()
  findOneBy(@Param('term') term: string, @GetUser() user: User) {
    return this.shedulesService.findOneBy(term, user);
  }

  @Get('fromuser/:userId') 
  @Auth()
  findAllByUser(@Param('userId') userId: string, @GetUser() user: User) {
    return this.shedulesService.findAllByUser(userId, user);
  }

  @Patch('edit/:id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateSheduleDto: UpdateSheduleDto,
    @GetUser() user: User,
  ) {
    return this.shedulesService.update(id, updateSheduleDto, user);
  }

  @Delete('delete/:id')
  @Auth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.shedulesService.remove(id, user);
  }
}
