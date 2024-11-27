export interface ILoginForm {
  login: string;
  password: string;
}

export enum LoginRes {
  admin = 'ADMIN',
  user = 'USER',
  notFound = 'NOT_FOUND',
}
