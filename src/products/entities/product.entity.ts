import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import {User} from "../../users/entities/user.entity";
import {Rating} from "../../ratings/entities/rating.entity";
import {Color} from "../../colors/entities/color.entity";
import {Coupon} from "../../coupons/entities/coupon.entity";






@Entity({name : "products"})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column({default : null})
    image: string;


    // @Column()
    // tags : string

    @Column()
    quantity: number;

    @Column()
    category : string;

    @Column()
    brand : string

    @Column({default : 0})
    sold : number

    @Column ({default : 0})
    totalrating : number

    // @ManyToMany(() => Color)
    // @JoinTable()
    // color: Color[];

    @Column()
    color : string;

    @OneToMany(() => Rating, rating => rating.product)
    ratings: Rating[];

    // @OneToMany(() => Coupon, coupon => coupon.product)
    // coupons: Coupon[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
