import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {Repository} from "typeorm";
import {Product} from "./entities/product.entity";
import slugify from "slugify";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Rating} from "../ratings/entities/rating.entity";
@Injectable()
export class ProductsService {



  constructor(
      @InjectRepository(Product)
      private readonly productsRepository : Repository<Product>,

      @InjectRepository(User)
      private readonly usersRepository : Repository<User>,

      @InjectRepository(Rating)
      private readonly ratingsRepository : Repository<Rating>,

  ) {
  }
  async create(createProductDto: CreateProductDto) {
    const slug = slugify(createProductDto.title)

    const newProduct = await this.productsRepository.create({
      title : createProductDto.title,
      slug : slug,
      category : createProductDto.category,
      brand : createProductDto.brand,
      description : createProductDto.description,
      color : createProductDto.color,
      price : createProductDto.price,
      quantity : createProductDto.quantity
    })


    await this.productsRepository.save(newProduct)
    return newProduct
  }

  async findAll(query : any) {
    // Filtering
    const queryObj = {...query}

    const excludeFields = ['page' , 'sort' , 'limit' , 'fields']

    excludeFields.forEach(el => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const qry = await this.productsRepository.createQueryBuilder('products');

    const conditions = JSON.parse(queryStr);

    console.log(conditions)

    Object.keys(conditions).forEach((field) => {
      const value = conditions[field];
      if (value && typeof value === 'object' && Object.keys(value).length > 0) {
        Object.keys(value).forEach((operator) => {
          const fieldValue = value[operator];
          switch (operator) {
            case '$gte':
              qry.andWhere(`products.${field} >= :${field}`, { [field]: fieldValue });
              break;
            case '$gt':
              qry.andWhere(`products.${field} > :${field}`, { [field]: fieldValue });
              break;
            case '$lte':
              qry.andWhere(`products.${field} <= :${field}`, { [field]: fieldValue });
              break;
            case '$lt':
              qry.andWhere(`products.${field} < :${field}`, { [field]: fieldValue });
              break;
          }
        });
      } else {
        qry.andWhere(`product.${field} = :${field}`, { [field]: value });
      }
    });


    // Sorting

    if (query.sort) {
      const sortFields = query.sort.split(",");
      sortFields.forEach((field) => {
        const sortOrder = field.startsWith("-") ? "DESC" : "ASC";
        const fieldName = field.replace(/^-/, ""); // Loại bỏ tiền tố "-"
        qry.addOrderBy(`products.${fieldName}`, sortOrder);
      });
    } else {
      qry.orderBy("products.createdAt", "DESC");
    }


    // limiting the fields
    // if (query.fields) {
    //   const fields = query.fields.split(",").map(field => `products.${field.trim()}`);
    //   fields.push("products.id");
    //   qry.select(fields);
    // }else {
    //   console.log('no')
    //
    //
    //
    // }
    if (query.fields) {
      const fields = query.fields.split(",").map(field => field.trim());
      const selectedFields = fields.filter(field => !field.startsWith('-')).map(field => `products.${field}`);
      const excludedFields = fields.filter(field => field.startsWith('-')).map(field => field.substring(1));

      if (selectedFields.length > 0) {
        const fieldsWithId = [...selectedFields, "products.id"];
        qry.select(fieldsWithId);
      }

      if (excludedFields.length > 0) {
        excludedFields.forEach(field => {
          qry.addSelect(`EXCLUDED(products.${field})`);
        });


      }
    }


    // pagination

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)

    const skip = (page - 1) * limit;




    qry.skip(skip).take(limit)


    if (query.page){
      const productCount = await this.productsRepository.count()
      console.log(productCount)

      if (skip > productCount) throw new HttpException('Trang này không tồn tại',HttpStatus.NOT_FOUND)
    }




    const product = await qry.getMany();
    return product;
  }

  async findOne(id: number) {

     const product = await this.productsRepository.findOne({where : { id : id}})
      if (!product) {
        throw new HttpException(`Không tồn tại product ${id}`, HttpStatus.NOT_FOUND)
      }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({where : { id : id}})
    if (!product) {
      throw new HttpException(`Không tồn tại product ${id}`, HttpStatus.NOT_FOUND)
    }
    Object.assign(product, updateProductDto);

    // Generate the slug from the updated product's title
    const slug = slugify(updateProductDto.title);
    product.slug = slug;


    await this.productsRepository.save(product);
    return product;
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({where : { id : id}})
    if (!product) {
      throw new HttpException(`Không tồn tại product ${id}`, HttpStatus.NOT_FOUND)
    }
    await this.productsRepository.delete(id)
    return product
  }

  async addToWishlist(user : any , productId : number){
    const userId = user.id
    const userWishlist = await this.usersRepository.findOne({

      relations: {
        wishlist : true
      },
      where : { id : userId }
    })



    const proWishlist = await this.findOne(productId)

   if (userWishlist) {
     // Tìm kiếm sản phẩm trong wishlist
     const alreadyAdded = userWishlist.wishlist.some((product) => {
       return product.id === productId;
     });

     if (alreadyAdded) {
       console.log('ok')
      userWishlist.wishlist = userWishlist.wishlist.filter((product)=> product.id !== productId)
       return await this.usersRepository.save(userWishlist)
     }else {
       userWishlist.wishlist.push(proWishlist);
       return await this.usersRepository.save(userWishlist)
     }
   }

  }

  async handleRating(user: any, body: any) {
    const userId = user.id;
    const { star, productId } = body;

    const userWishRating = await this.usersRepository.findOne({
      relations: ['ratings'],
      where: { id: userId }
    });

    const prodRating = await this.productsRepository.findOne({
      relations: ['ratings'],
      where: { id: productId }
    });




    if (!prodRating) {
      throw new HttpException('Không tồn tại sản phẩm', HttpStatus.NOT_FOUND);
    }



    const rating = await this.ratingsRepository.find({
      relations: {
        product: true,
        postedBy: true
      },
    })


    if (userWishRating) {
      const alreadyRated = rating.some((rating) => {
        return rating.postedBy.id === userId && rating.product.id === productId;
      });

      if (alreadyRated) {
        throw new HttpException('Bạn đã đánh giá sản phẩm này rồi', HttpStatus.BAD_REQUEST);
      }

      const newRating = this.ratingsRepository.create({
        star: star,
        product: prodRating,
        postedBy: userWishRating
      });



      await this.ratingsRepository.save(newRating);

      userWishRating.ratings.push(newRating);
      await this.usersRepository.save(userWishRating);

      prodRating.ratings.push(newRating);

      prodRating.totalrating = prodRating.ratings.length;

      await this.productsRepository.save(prodRating);
    }
  }

  // async saveAddress(user : any){
  //   const userId = user.id
  //   const userAddress = await this.usersRepository.findOne(userId)
  //
  // }

  async uploadImage(file : any){
    console.log(file)
    const urlImage = `http://localhost:3000/api/products/pictures/${file.filename}`

    console.log(urlImage)

  }



}
