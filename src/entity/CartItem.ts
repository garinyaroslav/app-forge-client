import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CartItem' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  cartId: number;

  @Column('integer')
  gameId: number;
}
