import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'GameGenere' })
export class GameGenere {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  genereName: string;
}
