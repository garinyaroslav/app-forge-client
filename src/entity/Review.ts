import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Review' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  rating: number;

  @Column('text')
  textComment: string;

  @Column('integer')
  gameId: number;

  @Column('integer')
  consumerId: number;
}
