import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name : 'DEPT_MST'})
export class Test1 {
    @PrimaryGeneratedColumn()
    id: number;
   @Column( { default : null})
    DEPT_CODE : string

    @Column( { default : null})
    START_DATE : string


    @Column()
    END_DATE : string

    @Column({default : null})
    DEPT_NAME : string

    @Column()
    LAYER : number

    @Column({default : null})
    UP_DIVISION_CODE : string

    @Column({default : 1})
    SLIT_VN : number

}
