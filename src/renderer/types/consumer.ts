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

export interface IProfile {
  email: string;
  firstName: string;
  lastName: string;
  regDate: number;
}

export interface IProfileObj {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
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
