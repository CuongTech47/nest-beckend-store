import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";



@Entity({name : "categoies"})
// @Index('idx_title', ['title'])
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique : true})
    title : string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
