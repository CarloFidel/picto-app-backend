import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShedulesModule } from './shedules/shedules.module';
import { VisualItemsModule } from './visual_items/visual_items.module';
import { ScheduleItemModule } from './schedule_item/schedule_item.module';

@Module({
  imports: [
    AuthModule,

    ShedulesModule,

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    VisualItemsModule,

    ScheduleItemModule,
  ],
})
export class AppModule {}
