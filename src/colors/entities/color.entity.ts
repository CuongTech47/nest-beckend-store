import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name : 'colors'})
export class Color {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
