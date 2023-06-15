import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./users/entities/user.entity";
import {Product} from "./products/entities/product.entity";
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { AddressesModule } from './addresses/addresses.module';
import {Address} from "./addresses/entities/address.entity";
import {PassportModule} from "@nestjs/passport";
import { ColorsModule } from './colors/colors.module';
import { RatingsModule } from './ratings/ratings.module';
import {Rating} from "./ratings/entities/rating.entity";
import {Color} from "./colors/entities/color.entity";
import {HandlebarsAdapter, MailerModule} from "@nest-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { join } from 'path';
import { BlogsModule } from './blogs/blogs.module';
import {Blog} from "./blogs/entities/blog.entity";
import { CategoriesModule } from './categories/categories.module';
import {Category} from "./categories/entities/category.entity";
import { BrandsModule } from './brands/brands.module';
import {Brand} from "./brands/entities/brand.entity";
import { CouponsModule } from './coupons/coupons.module';
import {Coupon} from "./coupons/entities/coupon.entity";
import { Test1Module } from './test1/test1.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'shop_app',
      entities: [User, Product, Blog, Address , Rating ,Color , Category , Brand , Coupon ],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'cuongtech47@gmail.com',
            pass: 'tpipinekcmcehqyd',
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir : join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule, AuthModule, ProductsModule, AddressesModule , PassportModule.register({session : true}), ColorsModule, RatingsModule, BlogsModule, CategoriesModule, BrandsModule, CouponsModule, Test1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
