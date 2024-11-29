export interface ILoginForm {
  login: string;
  password: string;
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
