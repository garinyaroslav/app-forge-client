/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import crypto from 'crypto';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function hashPassword(
  password: string,
  salt: string,
  saltRounds: number,
) {
  const keyLength = 64;

  const hash = crypto
    .pbkdf2Sync(password, salt, saltRounds, keyLength, 'sha512')
    .toString('hex');

  return hash;
}

export function verifyPassword(
  password: string,
  hash: string,
  salt: string,
  iterations: number,
) {
  const keyLength = 64;
  const computedHash = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, 'sha512')
    .toString('hex');

  return computedHash === hash;
}
