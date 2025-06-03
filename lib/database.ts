import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Exam } from "./entities/Exam";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "8888",
    database: "user",
    synchronize: true,
    logging: false,
    entities: [User, Exam],
    migrations: [],
    subscribers: [],
});
