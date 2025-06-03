import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "user",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
