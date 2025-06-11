import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'exam_records' }) // 指定表名
export class ExamRecord {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 64, comment: '考试ID' })
  examId!: string;

  @Column({ type: 'varchar', length: 32, comment: '用户姓名' })
  username!: string;

  @Column({ type: 'varchar', length: 32, comment: '考试得分' })
  totalScore!: number;

  @Column({ type: 'varchar', length: 32, comment: '正确题数' })
  correctCount!: number;

  @CreateDateColumn({ comment: '记录创建时间' })
  createdAt!: Date;
}