import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {User} from "../users/entities/user.entity";
import {Rating} from "../ratings/entities/rating.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Product , User , Rating])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
