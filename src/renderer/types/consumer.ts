export interface IConsumer {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  regDate: number;
  isAdmin: boolean;
}

export type TConsumer =
  | 'id'
  | 'username'
  | 'email'
  | 'passwordHash'
  | 'firstName'
  | 'lastName'
  | 'regDate'
  | 'isAdmin';
