export interface IConsumer {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_staff: boolean;
}

export interface IProfile {
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface IProfileObj {
  id: number;
  email: string;
  last_name: string;
  date_joined: string;
}

export type TConsumer =
  | 'id'
  | 'username'
  | 'email'
  | 'password'
  | 'first_name'
  | 'last_name'
  | 'date_joined'
  | 'is_staff';
