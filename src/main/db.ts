import { DataSource } from 'typeorm';
import { Game } from '../entity/Game';
import { Cart } from '../entity/Cart';
import { CartItem } from '../entity/CartItem';
import { Consumer } from '../entity/Consumer';
import { GameGenre } from '../entity/GameGenre';
import { Library } from '../entity/Library';
import { Review } from '../entity/Review';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'master',
  synchronize: false,
  logging: true,
  entities: [Game, Cart, CartItem, Consumer, GameGenre, Library, Review],
  migrationsTableName: 'migrations',
});
