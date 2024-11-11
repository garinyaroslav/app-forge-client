import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from './Game';
import { Cart } from './Cart';

@Entity({ name: 'CartItem' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  cartId: number;

  @Column('integer')
  gameId: number;

  @ManyToOne(() => Game, (game) => game.cartItems)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
}
