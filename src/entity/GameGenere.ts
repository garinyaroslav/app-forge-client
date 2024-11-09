import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'GameGenre' })
export class GameGenere {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  genreName: string;
}
