import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import * as process from "process";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authService : AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromExtractors([
                    (request) => {
                        let token = null;
                        if (request && request.cookies) {
                            token = request.cookies['access_token'];
                        }
                        return token;
                    },
                ]),
            ]),

            secretOrKey: process.env.SECRETKEY,
        });
    }
    async validate({ email }) {
        const user = await this.authService.validateUser(email)
        if (!user) {
            throw new HttpException('Token không hợp lệ', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}