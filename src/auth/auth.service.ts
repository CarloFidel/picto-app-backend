import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { STATUS_CODES } from 'http';
import { JwtPayload } from './interfaces/jwt-payloda.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return {
        ...userData,
        token: this.getJwToken({
          email: user.email,
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
        }),
      };
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        name: true,
        lastName: true,
        id: true,
        role: true
      },
    });

    if (!user)
      throw new UnauthorizedException(`No user with this email ${email}`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (passowrd)');

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,

      token: this.getJwToken({
        email: user.email,
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        role: user.role
      }),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  remove(id: string) {
    const user = this.findOne(id);
    this.userRepository.delete({ id });
    return {
      status: 200,
      message: 'Deleted succesfull',
    };
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
