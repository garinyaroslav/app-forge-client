import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Game } from './Game';

@Entity({ name: 'GameGenre' })
export class GameGenre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  genreName: string;

  @OneToMany(() => Game, (game) => game.gameGenres)
  games: Game[];
}
