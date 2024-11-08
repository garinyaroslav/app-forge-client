import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  consumerId: number;
}
