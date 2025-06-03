
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";


@Entity("questions") // 题目表
export class Question {
    @PrimaryGeneratedColumn() // 主键ID，自动生成
    id!: number;

    @Column({ type: "text" }) // 题目内容（题干）
    content!: string;

    @Column({ type: "json" }) // 题目选项（存储为JSON数组，如["选项A", "选项B"]）
    options!: string[];

    @Column({ type: "varchar", length: 2 }) // 正确答案（存储选项字母，如"A"、"B"）
    correctAnswer!: string;

    @Column({ type: "int" }) // 题目分值
    score!: number;


}