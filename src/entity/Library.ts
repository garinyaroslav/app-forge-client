import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from './Game';
import { Consumer } from './Consumer';

@Entity({ name: 'Library' })
export class Library {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  gameId: number;

  @Column('integer')
  consumerId: number;

  @Column('bigint')
  addedDate: number;

  @ManyToOne(() => Game, (game) => game.libraries)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(() => Consumer, (consumer) => consumer.libraries)
  @JoinColumn({ name: 'consumerId' })
  consumer: Consumer;
}
