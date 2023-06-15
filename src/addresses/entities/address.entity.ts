import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
@Entity({ name: 'addresses' })
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    city: string;

    // @Column()
    // receiverName: string;

    @ManyToOne(() => User, user => user.addresses)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
