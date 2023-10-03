import { DataSource, DataSourceOptions } from "typeorm";

// docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=a7BSQzn5PaQVCfkX -d mysql:5.7
export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "a7BSQzn5PaQVCfkX",
  database: "dev",
  synchronize: false,
  logging: false,
  entities: [__dirname + "/**/entity/*{.ts,.js}"],
  migrations: [__dirname + "/**/migration/*.ts"],
  subscribers: [],
  logger: "advanced-console",
  timezone: "Z",
};

export const AppDataSource = new DataSource(dataSourceOptions);
