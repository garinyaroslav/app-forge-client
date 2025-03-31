export interface ILoginForm {
  username: string;
  password: string;
}

export interface ILoginRes {
  refresh: string;
  access: string;
  userId: number;
  is_staff: boolean;
}

export interface IRegisterForm {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export enum LoginRes {
  admin = 'ADMIN',
  user = 'USER',
  notFound = 'NOT_FOUND',
}
