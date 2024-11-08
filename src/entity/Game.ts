import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('integer')
  rating: string;

  @Column('integer')
  gameGenereId: number;

  @Column('bigint')
  relDate: number;

  @Column('bytea')
  image: string;
}
