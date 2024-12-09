import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consumer } from './Consumer';
import { Game } from './Game';

@Entity({ name: 'Review' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric')
  rating: number;

  @Column('text')
  textComment: string;

  @Column('integer')
  gameId: number;

  @Column('integer')
  consumerId: number;

  @ManyToOne(() => Consumer, (consumer) => consumer.reviews)
  @JoinColumn({ name: 'consumerId' })
  consumer: Consumer;

  @ManyToOne(() => Game, (game) => game.reviews)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
