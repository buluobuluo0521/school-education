import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("wrong_books") // Specify the table name explicitly
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
}
