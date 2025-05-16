import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'hogar_de_libros_db',
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
});

export default AppDataSource;
