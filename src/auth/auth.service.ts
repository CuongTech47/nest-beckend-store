import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-auth.dto';
import {RegisterAuthDto} from "./dto/register-auth.dto";
import * as bcrypt from "bcrypt";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";
import {LoginAuthDto} from "./dto/login-auth.dto";
import { JwtService } from "@nestjs/jwt";
import * as process from "process";
import {UsersService} from "../users/users.service";
@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private readonly usersRepository : Repository<User>,
      private readonly jwtService : JwtService,
      private readonly userService : UsersService,
  ) {
  }
  async register(regsterAuthDto: RegisterAuthDto) {
    const { mobile } = regsterAuthDto;
    const user = await this.usersRepository.findOne({where : {email : regsterAuthDto.email}})
    if (user) {
      // user đã tồn tại trong hệ thống
      throw new HttpException('User already exists in the system', HttpStatus.BAD_REQUEST)
    }
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(regsterAuthDto.password, salt);
    const newUser = await this.usersRepository.create({
      firstName : regsterAuthDto.firstName,
      lastName : regsterAuthDto.lastName,
      mobile : regsterAuthDto.mobile,
      email : regsterAuthDto.email,
      password : hashedPassword,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async login(loginAuthDto : LoginAuthDto) {
    const user = await this.usersRepository.findOne({where : { email : loginAuthDto.email}})
    if (!user) {
      throw new HttpException('User không tồn tại trong hệ thống' , HttpStatus.BAD_REQUEST)
    }
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Sai mật khẩu' , HttpStatus.BAD_REQUEST);
    }
    const token = await this._createToken(user);

    return {
      id : user.id,
      email : user.email,
      roles : user.role,
      ...token
    }

  }

  // private _createToken(user : User) {
  //   const accessToken = this.jwtService.sign({})
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async _createToken(user: User , refresh = true) {
    const accessToken = this.jwtService.sign({ id : user.id , email : user.email , roles : user.role})
    if (refresh) {
      const refreshToken = this.jwtService.sign({ id : user.id , email : user.email , roles : user.role},{
        secret : process.env.SECRETKEY_REFRESH,
        expiresIn : process.env.EXPIRESIN_REFRESH
      })
      await this.usersRepository.update({email : user.email}, {refreshToken : refreshToken})
      return {
        expiresIn : process.env.EXPIRESIN,
        refreshExpiresIn : process.env.EXPIRESIN_REFRESH,
        accessToken,
        refreshToken
      }
    } else {
      return {
        expiresIn : process.env.EXPIRESIN,
        accessToken,
      }
    }
  }


  async validateUser(email) {
    const user = await this.usersRepository.findOneBy({email : email})
    if (!user) {
      throw new HttpException('Token không hợp lệ' , HttpStatus.UNAUTHORIZED)
    }
    return {
      id : user.id,
      email : user.email,
      lastName : user.lastName,
      firstName : user.firstName,
      mobile : user.mobile,
      roles : user.role
    }
  }
  async handleRefreshToken(refreshToken) {
    try {
      const payload = await this.jwtService.verify(refreshToken , {
        secret : process.env.SECRETKEY_REFRESH
      })
      const user = await this.userService.getUserByRefresh(refreshToken , payload.email)


      const token = await this._createToken(user , false)
      return {
        id : user.id,
        email : user.email,
        roles : user.role,
        ...token
      }
    }catch (e) {
      throw new HttpException('Token Không hợp lệ', HttpStatus.UNAUTHORIZED)
    }
  }

  async logout(user){
    await this.usersRepository.update({email : user.email} , {refreshToken : null})
  }
}
