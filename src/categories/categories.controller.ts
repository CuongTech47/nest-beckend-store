import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/utils/Guards";
import {Roles} from "../auth/decorator/roles.decorator";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(+id);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}
