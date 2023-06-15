import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Blog} from "./entities/blog.entity";
import {UsersModule} from "../users/users.module";



@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UsersModule],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
