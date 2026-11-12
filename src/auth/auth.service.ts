import {
  BadRequestException,
  HttpException,
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
import { JwtPayload } from './interfaces/jwt-payloda.interface';
import { JwtService } from '@nestjs/jwt';
import { GoogleToken } from './dto/google-token.dto';
import { OAuth2Client } from 'google-auth-library';
import { ValidRoles } from './interfaces/roles.interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { truncate } from 'node:fs';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, avatar, roles, ...userData } = createAuthDto;
      const avatarUrl = avatar ?? '';
      const userRoles = roles?.length ? roles : [ValidRoles.user];

      const existUser = await this.userRepository.findOne({ 
        where: { email: createAuthDto.email }, 
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          roles: true,
          isActive: true,
          password: true,
        },
      });

      if (existUser && existUser.isActive === false) {
        if ( !existUser.password || !bcrypt.compareSync(password, existUser.password)) {
          throw new UnauthorizedException('If you want to recover your old account, you need to provide the correct password');
        }
        await this.userRepository.update(existUser.id, { isActive: true});
        return {
          id: existUser.id,
          email: existUser.email,
          name: existUser.name,
          lastName: existUser.lastName,
          roles: existUser.roles,
          token: this.getJwToken({
            email: existUser.email,
            id: existUser.id,
            name: existUser.name,
            lastName: existUser.lastName,
            roles: existUser.roles!,
          }),
        }
      }


      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        avatar: avatarUrl,
        roles: userRoles

      });

      await this.userRepository.save(user);

      return {
        ...userData,
        avatar,
        roles: userRoles,

        token: this.getJwToken({
          email: user.email,
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          roles: user.roles!,
        }),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
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
        isActive: true
      },
    });

    if (!user)
      throw new NotFoundException(`No hay usuario con el email ${email}`);

    if (!user.password || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('La contraseña es incorrecta');

    if (user.isActive === false) {
      throw new NotFoundException('User not exists');
    }

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

    await this.userRepository.update(existUser.id, { isActive: false });
    return {
      status: 200,
      message: 'Deleted succesfull',
    };
  }

  async loginGoogle(GoogleToken: GoogleToken) {

    const client = new OAuth2Client()
    const { token, roles } = GoogleToken

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
      throw new UnauthorizedException('Problems with Google Auth')
    }

    const payload = ticket.getPayload()


    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new UnauthorizedException('Invalid Google Token');
    }

    const existUser = await this.userRepository.findOne({ where: { email: payload.email } });

    if (existUser && existUser.isActive === false) {
      await this.userRepository.update(existUser.id, { isActive: true, password: null });
      return {
        ...existUser,
        token: this.getJwToken({
          email: existUser.email,
          id: existUser.id,
          name: existUser.name,
          lastName: existUser.lastName,
          roles: existUser.roles!,
        }),
      };
    }

    const userData = {
      name: payload.given_name ?? 'Provisional',
      email: payload.email!,
      lastName: payload.family_name ?? 'Name',
      roles: GoogleToken.roles,
      avatar: payload.picture ?? ''
    }


    const user = await this.userRepository.findOne({
      where: { email: userData.email },
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
        avatar: userData.avatar,

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

  async patchUser(updateUserDto: UpdateUserDto, userFromToken: User) {

    const userEmail = userFromToken.email;

    const existUser = await this.userRepository.findOne({ where: { email: userEmail } });

    if (!existUser) throw new NotFoundException(`User with ${userEmail} not found`);

    await this.userRepository.update(existUser.id, {
      name: updateUserDto.name,
      lastName: updateUserDto.lastName,
      avatar: updateUserDto.avatar,
    });

    const user = await this.userRepository.findOne({ where: { email: userEmail } });

    if (!user) throw new NotFoundException(`User with ${userEmail} not found`);
    return {
      ...user,
      token: this.getJwToken({
        email: user.email,
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        roles: user.roles!,
      }),
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
