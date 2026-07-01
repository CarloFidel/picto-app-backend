import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [IaController],
  providers: [IaService],
  imports: [AuthModule, ConfigModule],
})
export class IaModule {}
