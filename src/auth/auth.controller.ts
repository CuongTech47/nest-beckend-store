import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterAuthDto } from "./dto/register-auth.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";
import { Response , Request } from 'express';
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "./utils/Guards";
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Post('/login')
  async login(@Body() loginAuthDto : LoginAuthDto , @Res() res : Response){
    const result = await this.authService.login(loginAuthDto)


    res.cookie('access_token', result.accessToken, { httpOnly: true, maxAge: parseInt(result.expiresIn) });
    res.cookie('refresh_token', result.refreshToken, { httpOnly: true, maxAge: parseInt(result.refreshExpiresIn) });
    return res.send(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  async logout(@Req() req : Request, @Res() res : Response){
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken){
      throw new HttpException('Vui lòng Đăng Nhập',HttpStatus.UNAUTHORIZED)
    }

    res.clearCookie('access_token',{
      httpOnly : true,
      secure : true
    });
    res.clearCookie('refresh_token',{
      httpOnly : true,
      secure : true
    });

  await this.authService.logout(req.user)

   return res.sendStatus(204)

  }


  @Get('/refresh')
  async handleRefreshToken(@Req() req : Request , @Res() res : Response){

    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken){
      throw new HttpException('Vui lòng Đăng Nhập',HttpStatus.UNAUTHORIZED)
    }
    const result = await this.authService.handleRefreshToken(refreshToken)
    res.cookie('access_token', result.accessToken, { httpOnly: true, maxAge: parseInt(result.expiresIn) });
    return res.sendStatus(200)
  }


  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
