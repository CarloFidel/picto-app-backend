import { Module } from '@nestjs/common';
import { VisualItemsService } from './visual_items.service';
import { VisualItemsController } from './visual_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisualItem } from './entities/visual_item.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [VisualItemsController],
  providers: [VisualItemsService],
  imports: [TypeOrmModule.forFeature([VisualItem]), AuthModule],
})
export class VisualItemsModule {}
