// lib/entities/Exam.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("exam")
export class Exam {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    subject!: "语文";  // 语文科目

    @Column()
    questions!: number;

    @Column({ name: 'total_score' })
    totalScore!: number;

    @Column()
    duration!: string;

    @Column({ name: 'start_time', type: 'datetime', nullable: true })
    startTime!: Date | null;

    @Column({ name: 'end_time', type: 'datetime', nullable: true })
    endTime!: Date | null;

    @Column({
        type: "enum",
        enum: ["固定试卷", "时段试卷", "任务试卷"]
    })
    type!: string;
}