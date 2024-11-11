import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from './Review';
import { Library } from './Library';

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

  @OneToMany(() => Review, (review) => review.consumer)
  reviews: Review[];

  @OneToMany(() => Library, (library) => library.consumer)
  librarys: Review[];
}
