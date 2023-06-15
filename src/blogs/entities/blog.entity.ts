import {
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

import {User} from "../../users/entities/user.entity";


@Entity({name : "blogs"})
export class Blog {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title : string

    @Column()
    description : string

    @Column()
    category : string

    @Column( {default : 0})
    numViews : number

    @Column({default : false})
    isLiked : boolean

    @Column({default : false})
    isDisliked : boolean

    @Column({default : null})
    image : string

    @Column({default :'admin'})
    author : string

    // @Column({ select: false })
    // toJSON: boolean;
    //
    // @Column({ select: false })
    // toObject: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @ManyToOne(() => User, user => user.likedBlogs)
    // likes: User;
    //
    // @ManyToOne(() => User, user => user.dislikedBlogs)
    // dislikes: User;
    @ManyToMany(() => User)
    @JoinTable()
    likedByUsers: User[];

    @ManyToMany(() => User)
    @JoinTable()
    dislikedByUsers: User[];

}
