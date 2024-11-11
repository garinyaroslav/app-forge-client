import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './Review';
import { Library } from './Library';
import { CartItem } from './CartItem';
import { GameGenere } from './GameGenere';

@Entity({ name: 'Game' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  developerName: string;

  @Column('numeric')
  rating: number;

  @Column('numeric')
  price: number;

  @Column({ type: 'integer', default: 0 })
  copiesSold: number;

  @Column('integer')
  gameGenreId: number;

  @Column('bigint')
  relDate: number;

  @Column('bytea')
  image: string;

  @OneToMany(() => Review, (review) => review.game)
  reviews: Review[];

  @OneToMany(() => Library, (library) => library.game)
  librarys: Library[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.game)
  cartItems: CartItem[];

  @ManyToOne(() => GameGenere, (gameGenere) => gameGenere.games)
  @JoinColumn({ name: 'gameGenreId' })
  gameGeneres: GameGenere[];
}
