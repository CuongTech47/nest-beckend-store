import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";


@Entity({name :'brands'})
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique : true})
    title : string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
