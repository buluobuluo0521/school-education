import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")  // 明确指定表名
export class User {
    @PrimaryGeneratedColumn()
    id!: number;  // 添加非空断言

    @Column({ type: "varchar", length: 255 })
    username!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP" 
    })
    createdAt!: Date;
}