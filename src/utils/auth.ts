import crypto from 'crypto';

export function hashPassword(
  password: string,
  salt: string,
  saltRounds: number = 10,
) {
  const iterations = 2 ** saltRounds;
  const keyLength = 64;

  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, 'sha512')
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
