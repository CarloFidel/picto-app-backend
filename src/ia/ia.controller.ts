import { Controller, Post, Body } from '@nestjs/common';
import { IaService } from './ia.service';
import { GenerateWordsDto } from './dto/create-ia.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/auth.entity';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('generate')
  @Auth()
  generate(@Body() generateWordsDto: GenerateWordsDto, @GetUser() user: User) {
    return this.iaService.generate(generateWordsDto, user);
  }
}
