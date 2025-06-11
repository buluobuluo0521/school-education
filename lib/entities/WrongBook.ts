import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity("wrong_books") // Specify the table name explicitly
@Index(['username', 'questionId', 'examType', 'examName'], { unique: true })
export class WrongBook {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  questionId!: number;

  @Column()
  userAnswer!: string;

  @Column()
  correctAnswer!: string;

  @Column()
  content!: string;

  @Column("simple-array")
  options!: string[];

  @Column()
  examType!: string;

  @Column()
  examName!: string;
}
