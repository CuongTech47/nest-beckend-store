import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Blog} from "./entities/blog.entity";
import {Repository} from "typeorm";
import {User} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";

@Injectable()
export class BlogsService {

  constructor(
      @InjectRepository(Blog)
      private readonly blogsRepository : Repository<Blog>,

      private usersService : UsersService


  ) {
  }
  async create(createBlogDto: CreateBlogDto) {
    const { title , category , description } = createBlogDto
    const newBlog = await this.blogsRepository.create({
      title : title,
      category : category,
      description : description
    })

    await this.blogsRepository.save(newBlog)
    return newBlog
  }

  async findAll() {
    const blog = await this.blogsRepository.find()
    return blog;
  }

  async findOne(id: number) {
    const blog = await this.blogsRepository.findOne({where : {id : id}})
    if (!blog) {
      throw new HttpException('Blog Không tồn tại' , HttpStatus.NOT_FOUND)
    }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.findOne(id);
    Object.assign(blog , updateBlogDto)
    await this.blogsRepository.save(blog)
    return blog;
  }

  async getAnBlog(id : number){
    const blog = await this.findOne(id);
    blog.numViews +=1
    await this.blogsRepository.save(blog);
    return blog;
  }

  async remove(id: number) {
    const blog = await this.findOne(id)
    await this.blogsRepository.delete(id)
    return blog;
  }


  async likeBlog(body : any , user : any ){
    const { blogId } = body;
    const { id } = user;

    const query = this.blogsRepository.createQueryBuilder('blogs_liked_by_users_users');



    // Tìm blog muốn được thích

    const blog = await this.findOne(blogId)

    //tìm người đăng nhập
    const loginUserId  = id

    // tìm xem người dùng có thích blog không

    // const isLiked = blog?.isLiked

    blog.isLiked = true

    await this.blogsRepository.save(blog)

    // tìm nếu người dùng không thích blog



  if (blog.isLiked){
    await query.insert().into('blogs_liked_by_users_users').values({usersId : id , blogsId : blogId}).execute()
  }



    // await this.usersService.userByDisLiked(id , blogId)

  }
}
