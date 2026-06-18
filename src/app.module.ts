import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShedulesModule } from './shedules/shedules.module';
import { ScheduleItemsModule } from './schedule_items/schedule_items.module';
import { VisualItemsModule } from './visual_items/visual_items.module';

@Module({
  imports: [
    AuthModule,

    ShedulesModule,
    
    ScheduleItemsModule,
    
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


  ],
})
export class AppModule {}
