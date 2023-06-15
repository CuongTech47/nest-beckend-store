import {ConflictException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Brand} from "./entities/brand.entity";
import {Repository} from "typeorm";

@Injectable()
export class BrandsService {
  constructor(
      @InjectRepository(Brand)
      private readonly brandsRepository : Repository<Brand>
  ) {
  }
  async create(createBrandDto: CreateBrandDto) {
    try {
      const newBrand = await this.brandsRepository.create({
        title: createBrandDto.title,
      });
      return await this.brandsRepository.save(newBrand);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Xử lý trường hợp trùng lặp title ở đây
        throw new ConflictException('Brand with the same title already exists');
      }
      throw error;
    }

  }

  async findAll() {
    const brands = await this.brandsRepository.find();
    return brands;
  }

  async findOne(id: number) {
    const brand = await this.brandsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!brand) {
      throw new HttpException('Không tồn tại brand', HttpStatus.NOT_FOUND);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    await this.brandsRepository.save(brand);
    return brand;
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandsRepository.delete(id);
    return brand;
  }
}
