import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/utils/Guards";
import {Roles} from "../auth/decorator/roles.decorator";

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @Roles('admin')
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(+id);
  }
}
