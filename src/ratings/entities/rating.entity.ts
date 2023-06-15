import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {User} from "../../users/entities/user.entity";
import {Product} from "../../products/entities/product.entity";

@Entity({name : 'ratings'})
export class Rating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : 0} )
    star: number;

    @Column({default : null})
    comment: string;

    @ManyToOne(() => User, user => user.ratings)
    postedBy: User;

    @ManyToOne(() => Product, product => product.ratings)
    product: Product;
}