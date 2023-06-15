import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../products/entities/product.entity";


@Entity({name : 'coupons'})
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique : true})
    name : string

    @Column({default : null})
    expiry : Date

    @Column()
    discount : number

    // @ManyToOne(() => Product, product => product.coupons)
    // product: Product;
}
