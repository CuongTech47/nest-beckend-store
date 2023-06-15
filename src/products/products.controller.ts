import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  Req,
  UseInterceptors, UploadedFile, HttpException, HttpStatus, Res
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {Roles} from "../auth/decorator/roles.decorator";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/utils/Guards";
import {Request, Response, response} from "express";
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from "multer"
import * as path from "path";
import  sharp  from "sharp";


@Controller('products')
export class ProductsController {
  constructor(
      private readonly productsService: ProductsService) {}



  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }



  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: "./uploads/images/products",
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join("_") + "_" + Date.now() + '.' + fileExtension;
        cb(null, newFileName);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(null, false);
      }
      callback(null, true);
    }
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Không tồn tại Image', HttpStatus.BAD_REQUEST);
    } else {
      let response;

      try {

        response = {
          filePath: `http://localhost:3000/api/products/pictures/${file.filename}`
        };
      } catch (error) {
        // Xử lý lỗi xảy ra trong quá trình xử lý ảnh
        console.error(error);
        throw new HttpException('Lỗi xử lý ảnh', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      await this.productsService.uploadImage(file.path);
      return response;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('wishlist')
  async addToWishLish(@Req() req: Request , @Body() proId : any){
    const user = req.user

    const productId = proId.productId

    return await this.productsService.addToWishlist(user , productId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rating')
  async addToRating(@Req() req: Request , @Body() body : any){
    const user = req.user
    return await this.productsService.handleRating(user , body)
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename , @Res() res : Response){
      res.sendFile(filename, {root: './uploads/images/products'})
  }


  @Get()
  findAll(@Query() query : string) {

    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }







  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
