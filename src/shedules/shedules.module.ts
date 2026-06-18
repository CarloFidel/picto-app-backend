import { Module } from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { ShedulesController } from './shedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shedule } from './entities/shedule.entity';

@Module({
  controllers: [ShedulesController],
  providers: [ShedulesService],
  imports: [TypeOrmModule.forFeature([Shedule])],
})
export class ShedulesModule {}
