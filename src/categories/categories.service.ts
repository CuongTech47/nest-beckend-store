import {ConflictException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {Repository} from "typeorm";

@Injectable()
export class CategoriesService {
  constructor(
      @InjectRepository(Category)
      private readonly categoriesRepository : Repository<Category>
  ) {
  }
  async create(createCategoryDto: CreateCategoryDto) {

    try {
      const newCategory = await this.categoriesRepository.create({
        title: createCategoryDto.title,
      });
      return await this.categoriesRepository.save(newCategory);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Xử lý trường hợp trùng lặp title ở đây
        throw new ConflictException('Category with the same title already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const categories = await this.categoriesRepository.find()
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({where : {id : id}})
    if (!category) {
      throw new HttpException('Không tồn tại category', HttpStatus.NOT_FOUND)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)

    Object.assign(category , updateCategoryDto)
    await this.categoriesRepository.save(category)
    return category
  }

  async remove(id: number) {
    const category = await this.findOne(id)
    await this.categoriesRepository.delete(id)
    return category;
  }
}
