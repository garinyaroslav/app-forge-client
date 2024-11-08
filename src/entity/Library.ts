import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
