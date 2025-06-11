import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Exam } from "./entities/Exam";
import { Question } from "./entities/Question";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "user",
    synchronize: true,
    logging: false,
    entities: [User, Exam,Question],
    migrations: [],
    subscribers: [],
});
