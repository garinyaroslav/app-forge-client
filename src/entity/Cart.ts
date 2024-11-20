import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Consumer } from './Consumer';
import { CartItem } from './CartItem';

@Entity({ name: 'Cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { unique: true })
  consumerId: number;

  @OneToOne(() => Consumer, (consumer) => consumer.cart)
  @JoinColumn({ name: 'consumerId' })
  consumer: Consumer;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}
