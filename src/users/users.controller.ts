import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/utils/Guards";
import {Roles} from "../auth/decorator/roles.decorator";
import {UpdatePasswordDto} from "./dto/update-password.dto";
import {Request} from "express";
import {LoginAuthDto} from "../auth/dto/login-auth.dto";
import {CreateAddressDto} from "../addresses/dto/create-address.dto";
import {CreateUserAddressDto} from "./dto/create-userAddress.dto";

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Post('forgot-password-token')
  async forgotPassword(@Body() createUserDto : CreateUserDto){
    return await this.usersService.forgotPasswordToken(createUserDto)
  }





  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }



  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/block-user/:id')
  @Roles('admin')
  blockUser(@Param('id') id : string ){
    return this.usersService.blockUser(+id);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/unblock-user/:id')
  @Roles('admin')
  unBlockUser(@Param('id') id : string ){
    return this.usersService.unBlockUser(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('save-address')
  async saveAddress(@Body() createAddress : CreateUserAddressDto ,  @Req() req : Request ){
    const user = req.user
    return await this.usersService.saveAddress( createAddress ,  user)
  }


  @UseGuards(AuthGuard('jwt'))
  @Put('updatePassword')
  async updatePassword(@Body() updatePassword : UpdatePasswordDto , @Req() req : Request ) {

    const user = req.user


    return await this.usersService.updatePassword(updatePassword , user )
  }

  @Put('reset-password/:token')
  async resetPassword(@Param('token') token : string , @Body() body : LoginAuthDto){

    return await this.usersService.resetPassword(token , body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

}
