import {ConflictException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Coupon} from "./entities/coupon.entity";
import {Repository} from "typeorm";

@Injectable()
export class CouponsService {
  constructor(
      @InjectRepository(Coupon)
      private readonly couponsRepository : Repository<Coupon>
  ) {
  }
  async create(createCouponDto: CreateCouponDto) {
    const { name , expiry , discount  } = createCouponDto
    try {
      const newCoupons = await this.couponsRepository.create({
        name : name,
        expiry : expiry,
        discount : discount
      });
      return await this.couponsRepository.save(newCoupons);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Xử lý trường hợp trùng lặp title ở đây
        throw new ConflictException('Coupon with the same name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const coupons = await this.couponsRepository.find()
    return coupons
  }

  async findOne(id: number) {
    const coupon = await this.couponsRepository.findOne({where : {id : id}})
    if (!coupon) {
      throw new HttpException('Không tồn tại coupon', HttpStatus.NOT_FOUND)
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {

    const coupon = await this.findOne(id)

    Object.assign(coupon , updateCouponDto)
    await this.couponsRepository.save(coupon)
    return coupon
  }

  async remove(id: number) {
    const coupon = await this.findOne(id)
    await this.couponsRepository.delete(id)
    return coupon;
  }
}
