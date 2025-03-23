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
  login: string;
  password: string;
  email: string;
  fname: string;
  lname: string;
}

export enum LoginRes {
  admin = 'ADMIN',
  user = 'USER',
  notFound = 'NOT_FOUND',
}
