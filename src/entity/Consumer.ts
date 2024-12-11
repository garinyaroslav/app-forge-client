import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Review } from './Review';
import { Library } from './Library';
import { Cart } from './Cart';

@Entity({ name: 'Consumer' })
export class Consumer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  username: string;

  @Column('text')
  email: string;

  @Column('text')
  passwordHash: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('bigint')
  regDate: number;

  @Column('boolean')
  isAdmin: boolean;

  @OneToMany(() => Review, (review) => review.consumer)
  reviews: Review[];

  @OneToMany(() => Library, (library) => library.consumer)
  libraries: Review[];

  @OneToOne(() => Cart, (cart) => cart.consumer)
  cart: Cart;
}
