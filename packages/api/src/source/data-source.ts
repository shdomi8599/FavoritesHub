import { DataSource, DataSourceOptions } from "typeorm";

//  AWS
// docker run --platform linux/amd64 --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=a7BSQzn5PaQVCfkX -d mysql:5.7

// M1칩 arm64v8 사용 < 오라클
// sudo docker pull arm64v8/mysql
// sudo docker run --name favhub -p 3307:3307 -e MYSQL_ROOT_PASSWORD=a7BSQzn5PaQVCfkX -d arm64v8/mysql

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: "127.0.0.1",
  port: 3307,
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
