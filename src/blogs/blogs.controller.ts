import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/utils/Guards";
import {Roles} from "../auth/decorator/roles.decorator";
import {Request} from "express";

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  async getAnBlog(@Param('id') id: string) {
    return await this.blogsService.getAnBlog(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogsService.update(+id, updateBlogDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Put('likes')
  async likeBlog(@Body() body : any , @Req() req : Request){

    const user = req.user
    return await this.blogsService.likeBlog(body, user)
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.blogsService.remove(+id);
  }
}
