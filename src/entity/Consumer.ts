import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Consumer' })
export class Consumer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  username: string;

  @Column('text')
  email: string;

  @Column('text')
  passwordHash: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('bigint')
  relDate: string;
}
