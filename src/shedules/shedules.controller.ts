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
import { ApiResponse } from '@nestjs/swagger';
import { Shedule } from './entities/shedule.entity';

@Controller('shedules')
export class ShedulesController {
  constructor(private readonly shedulesService: ShedulesService) {}

  @ApiResponse({ status: 201, description: 'Schedule created successfully', type: Shedule})
  @ApiResponse({ status: 400, description: 'Invalid request data or validation failed'})
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token'})
  @ApiResponse({ status: 403, description: 'Forbidden: user not allowed to create this schedule'})
  @ApiResponse({ status: 500, description: 'Internal server error while creating the schedule'})
  @Post('create')
  @Auth()
  createFull(@Body() saveAllDto: SaveAllDto, @GetUser() user: User) {
    return this.shedulesService.createFull(saveAllDto, user);
  }

  @ApiResponse({ status: 200, description: 'Schedule found successfully'})
  @ApiResponse({ status: 400, description: 'Invalid search term'})
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token'})
  @ApiResponse({ status: 404, description: 'Schedule not found'})
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving the schedule'})
  @Get(':term') // por id o por title
  @Auth()
  findOneBy(@Param('term') term: string, @GetUser() user: User) {
    return this.shedulesService.findOneBy(term, user);
  }

  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully for the authenticated user'})
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token'})
  @ApiResponse({ status: 403, description: 'Forbidden: user not allowed to access these schedules'})
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving user schedules'})
  @Get('fromuser/')
  @Auth()
  findAllByUser(@GetUser() user: User) {
    return this.shedulesService.findAllByUser(user);
  }

  @ApiResponse({ status: 200, description: 'Schedule updated successfully'})
  @ApiResponse({ status: 400, description: 'Invalid update data or validation failed'})
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token'})
  @ApiResponse({ status: 403, description: 'Forbidden: user not allowed to update this schedule'})
  @ApiResponse({ status: 404, description: 'Schedule not found'})
  @ApiResponse({ status: 500, description: 'Internal server error while updating the schedule'})
  @Patch('edit/:id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateSheduleDto: UpdateSheduleDto,
    @GetUser() user: User,
  ) {
    return this.shedulesService.update(id, updateSheduleDto, user);
  }

  @ApiResponse({ status: 200, description: 'Schedule deleted successfully'})
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token'})
  @ApiResponse({ status: 403, description: 'Forbidden: user not allowed to delete this schedule'})
  @ApiResponse({ status: 404, description: 'Schedule not found'})
  @ApiResponse({ status: 500, description: 'Internal server error while deleting the schedule'})
  @Delete('delete/:id')
  @Auth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.shedulesService.remove(id, user);
  }
}
