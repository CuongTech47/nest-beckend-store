import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {MoreThan, Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {UpdatePasswordDto} from "./dto/update-password.dto";
import {MailerService} from "@nest-modules/mailer";
import {join} from "path";
import * as crypto from "crypto";
import * as http from "http";
import {CreateAddressDto} from "../addresses/dto/create-address.dto";
import {CreateUserAddressDto} from "./dto/create-userAddress.dto";

@Injectable()
export class UsersService {

  constructor(
      @InjectRepository(User)
      private readonly usersRepository : Repository<User>,
      private readonly mailerService : MailerService
  ) {
  }
  async create(createUserDto: CreateUserDto) {
    const { mobile } = createUserDto;
    const user = await this.usersRepository.findOne({where : {email : createUserDto.email}})
    if (user) {
      // user đã tồn tại trong hệ thống
      throw new HttpException('User already exists in the system', HttpStatus.BAD_REQUEST)
    }
    if (user.mobile == mobile) {
      throw new HttpException('Số điện thoại đã tồn tại trong hệ thống', HttpStatus.BAD_REQUEST);
    }



    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.usersRepository.create({
      firstName : createUserDto.firstName,
      lastName : createUserDto.lastName,
      mobile : createUserDto.mobile,
      email : createUserDto.email,
      password : hashedPassword,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    const allUsers = await this.usersRepository.find({
      relations : {wishlist : true , ratings : true}
    })
    return allUsers;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      relations : {wishlist : true , ratings : true},
      where : {id : id}
    })
    if (!user) {
      throw new HttpException('User không tồn tại trong hệ thống', HttpStatus.BAD_REQUEST)
    }
    return user;
    // const prodRating = await this.productsRepository.findOne({
    //   relations: ['ratings'],
    //   where: { id: productId }
    // });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({where : {id : id}});
    if (!user) {
      throw new HttpException('User không tồn tại trong hệ thống', HttpStatus.BAD_REQUEST);
    }

    const { email, mobile } = updateUserDto;
    if (email && email !== user.email) {
      const emailExists = await this.usersRepository.findOne({ where: { email }, select: ['id'] });
      if (emailExists && emailExists.id !== id) {
        throw new HttpException('Email đã tồn tại trong hệ thống', HttpStatus.BAD_REQUEST);
      }
    }
    if (mobile && mobile !== user.mobile) {
      const mobileExists = await this.usersRepository.findOne({ where: { mobile }, select: ['id'] });
      if (mobileExists && mobileExists.id !== id) {
        throw new HttpException('Số điện thoại đã tồn tại trong hệ thống', HttpStatus.BAD_REQUEST);
      }
    }

    const result = await this.usersRepository.update(id, updateUserDto);
    if (result.affected === 0) {
      throw new HttpException('Không thể cập nhật thông tin người dùng', HttpStatus.BAD_REQUEST);
    }

    return this.usersRepository.findOne({where : {id : id}});


  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({where : {id : id}})
    if (!user) {
      throw new HttpException('User không tồn tại trong hệ thống', HttpStatus.BAD_REQUEST)
    }
    await this.usersRepository.delete(id)
    return user;
  }
  async blockUser(id : number ){
      const user = await this.usersRepository.findOne({where : { id : id}})
      if (!user) {
        throw new HttpException('User Không tồn tại trong hệ thống',HttpStatus.BAD_REQUEST)
      }
      await this.usersRepository.update(id , {isBlocked : true})
    return { message: 'Block user thành công' };
  }
  async unBlockUser(id : number ){
    const user = await this.usersRepository.findOne({where : { id : id}})
    if (!user) {
      throw new HttpException('User Không tồn tại trong hệ thống',HttpStatus.BAD_REQUEST)
    }
    await this.usersRepository.update(id , {isBlocked : false})
    return { message: 'Unblock user thành công' };
  }

  async getUserByRefresh(refreshToken , email){
      const user = await this.usersRepository.findOne({where : {email : email}})
      if (!user ) {
        throw new HttpException('Token Không hợp lệ', HttpStatus.UNAUTHORIZED)
      }
      if (refreshToken != user.refreshToken) {
        throw new HttpException('Thông tin không hợp lệ' ,HttpStatus.UNAUTHORIZED)
      }

      return user

  }

  async updatePassword(updatePassword : UpdatePasswordDto , userId : any) {

    const user = await this.usersRepository.findOne({where : {id : userId.id}})

    if (!user) {
      throw new HttpException('User Không tồn tại trong hệ thống',HttpStatus.BAD_REQUEST)
    }
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(updatePassword.password , salt)



    user.password = hashedPassword

    return this.usersRepository.save(user)

  }

  async forgotPasswordToken(createUserDto : CreateUserDto){

    const user = await this.usersRepository.findOne({where : {email : createUserDto.email}})

    if (!user) {
      throw new HttpException('User Không tồn tại trong hệ thống',HttpStatus.BAD_REQUEST)
    }


    const token = await this.createPasswordToken(user);

    const resetURL = `http://localhost:3000/api/users/reset-password/${token}`

    await this.mailerService.sendMail({
      to : createUserDto.email,
      subject : `Fotgot Password Link `,
      template : './welcome',
      context : {
        name : createUserDto.firstName + createUserDto.lastName,
        resetURL : resetURL
      }
    })

    return token

  }

  async resetPassword( token : string , body : any) {

    const { password } = body

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password , salt)


    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
    const user = await this.usersRepository.findOne({
      where : {
        passwordResetToken : hashedToken,
        passwordResetExpires : MoreThan(new Date())
      }})
    if (!user){
      throw new HttpException('Token đã hết hạn, vui lòng thử lại sau',HttpStatus.UNAUTHORIZED)
    }
    user.password = hashedPassword
    user.passwordResetToken = null
    user.passwordResetExpires = null
    return await this.usersRepository.save(user)
  }


  private async createPasswordToken (user){
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex')

    const expirationTime = new Date();
    expirationTime.setTime(Date.now() + 30 * 60 * 1000);
    user.passwordResetExpires = expirationTime // 10p



    await this.usersRepository.save(user)


    return resetToken
  }

  async userByDisLiked (userId : number , blogId : number){
    // const query = this.usersRepository.createQueryBuilder('blogs_disliked_by_users_users');
    // await query.insert().into('blogs_disliked_by_users_users').values({usersId : userId , blogsId : blogId}).execute()

    const query = await this.usersRepository.createQueryBuilder('blogs_disliked_by_users_users')
        .where('blogs_disliked_by_users_users.usersId = :userId', { userId: userId }).getOne();



    if (query){
      console.log("ok")
    }





  }


  async saveAddress( createAddress : CreateUserAddressDto ,user : any){
    const userId = user.id;
    // const { address  } = createAddress
    const userAddress = await this.findOne(userId)
    // if (userAddress.address) {
    //   throw new HttpException('Địa Chỉ đã có trong hệ thống',HttpStatus.BAD_REQUEST)
    // }
    Object.assign(userAddress , createAddress)

    await this.usersRepository.save(userAddress);

    return userAddress;

    // console.log(userAddress)



  }
}
