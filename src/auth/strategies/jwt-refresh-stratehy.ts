import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/auth.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenPayload } from "../interfaces/jwt-refrech-payloda.interface";


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService,

    ) {
        super({
            secretOrKey: configService.get('JWT_REFRESH_SECRET')!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });

    }
    async validate(payload: RefreshTokenPayload): Promise<User> {
        const { type, id } = payload;

        if (type !== 'refresh') {
            throw new UnauthorizedException('Invalid token type');
        }

        const user = await this.userRepository.findOneBy({ id });

        if (!user) throw new UnauthorizedException('token not valid');

        if (!user.isActive) throw new UnauthorizedException('user is inactive');

        return user;
    }

}