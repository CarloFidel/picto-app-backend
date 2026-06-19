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
import { SaveAllDto } from './dto/save-all-shedule.dto';

@Controller('shedules')
export class ShedulesController {
  constructor(private readonly shedulesService: ShedulesService) {}

  @Post('create-all')
  @Auth()
  createFull(@Body() saveAllDto: SaveAllDto, @GetUser() user: User) {
    return this.shedulesService.createFull(saveAllDto, user);
  }

  @Get(':term') //por id o por title
  @Auth()
  findOneBy(@Param('term') term: string, @GetUser() user: User) {
    return this.shedulesService.findOneBy(term, user);
  }

  @Get('fromuser/:userId')
  @Auth()
  findAllByUser(@GetUser() user: User) {
    return this.shedulesService.findAllByUser(user);
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
