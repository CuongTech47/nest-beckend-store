import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import {Product} from "../../products/entities/product.entity";
import {Address} from "../../addresses/entities/address.entity";
import {Rating} from "../../ratings/entities/rating.entity";
import {Blog} from "../../blogs/entities/blog.entity";
@Entity({name : 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique : true})
    email : string

    @Column({unique : true})
    mobile : string

    @Column({default : null})
    address : string


    @Column()
    password : string

    @Column({default : "user"})
    role : string

    @Column({default : false})
    isBlocked : boolean
    // @Column()
    // cart : object

    @Column({default : null})
    refreshToken : string

    @OneToMany(() => Rating, rating => rating.postedBy)
    ratings: Rating[];

    @OneToMany(() => Address, address => address.user)
    addresses: Address[];

    // @OneToMany(() => Product, product => product.user)
    // wishList: Product[]

    // @OneToMany(() => Blog, blog => blog.likes)
    // likedBlogs: Blog[];
    //
    // @OneToMany(() => Blog, blog => blog.dislikes)
    // dislikedBlogs: Blog[];

    // @ManyToMany(() => Blog)
    // @JoinTable()
    // likedBlogs: Blog[];
    //
    // @ManyToMany(() => Blog)
    // @JoinTable()
    // dislikedBlogs: Blog[];

    @ManyToMany(() => Product)
    @JoinTable()
    // @JoinTable({ name: "wishlist" })
    wishlist: Product[];

    @Column({default : null})
    passwordChangeAt : Date

    @Column({default : null})
    passwordResetToken : string

    @Column({default : null})
    passwordResetExpires : Date



    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}