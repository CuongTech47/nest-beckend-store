import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/utils/Guards";
import {Roles} from "../auth/decorator/roles.decorator";

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  async create(@Body() createBrandDto: CreateBrandDto) {
    return await this.brandsService.create(createBrandDto);
  }

  @Get()
  async findAll() {
    return await this.brandsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.brandsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return await this.brandsService.update(+id, updateBrandDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.brandsService.remove(+id);
  }
}
