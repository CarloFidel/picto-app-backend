import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
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
import { GoogleToken } from './dto/google-token.dto';
import { OAuth2Client } from 'google-auth-library';
import { ValidRoles } from './interfaces/roles.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

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
          roles: user.roles!,
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
        roles: true,
      },
    });

    if (!user)
      throw new NotFoundException(`No hay usuario con el email ${email}`);

    if (!user.password || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('La contraseña es incorrecta');

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,

      token: this.getJwToken({
        email: user.email,
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        roles: user.roles!,
      }),
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { shedule: true },
    });

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async remove(user: User) {
    const existUser = await this.findOne(user.id);

    if (!existUser) {
      throw new BadRequestException(`No user with ${user.id} founded`);
    }

    await this.userRepository.delete({ id: user.id });
    return {
      status: 200,
      message: 'Deleted succesfull',
    };
  }

  async loginGoogle(token: GoogleToken) {

    const client = new OAuth2Client()

    const ticket = await client.verifyIdToken({
      idToken: token.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
      throw new UnauthorizedException('Problemas con Google Auth')
    }

    const payload = ticket.getPayload()


    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new UnauthorizedException('Token de Google inválido');
    }

    const userData = {
      name: payload.given_name ?? 'Provisional',
      email: payload.email!,
      lastName: payload.family_name ?? 'Name',
      roles: [ValidRoles.user],
    }


    const user = await this.userRepository.findOne({
      where: { email: payload.email },
      select: {
        email: true,
        name: true,
        lastName: true,
        id: true,
        roles: true,
      },
    });

    if (!user) {

      const newUser = this.userRepository.create({
        ...userData,
        password: null,
      });

      await this.userRepository.save(newUser);

      return {
        ...userData,
        token: this.getJwToken({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          lastName: newUser.lastName,
          roles: newUser.roles!,
        }),
      };

    } else {

      return {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,

        token: this.getJwToken({
          email: user.email,
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          roles: user.roles!,
        }),
      };
    }
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new ConflictException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
