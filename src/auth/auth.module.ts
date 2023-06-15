import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {User} from "../users/entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./utils/jwt.strategy";
import {UsersModule} from "../users/users.module";







@Module({
  imports: [TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports :[ConfigModule],
      useFactory : async (configService: ConfigService) =>({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN'),
        }
      }),
      inject : [ConfigService]
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService ,JwtStrategy ,],

})
export class AuthModule {}
