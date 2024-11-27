import { ipcMain } from 'electron';
import { hashPassword, verifyPassword } from '../../utils/auth';

import { salt, saltRounds } from '../../constants/crypto';

ipcMain.handle('crypto:hash', async (_, password: string) => {
  try {
    const hash = await hashPassword(password, salt, saltRounds);
    return hash;
  } catch (error) {
    console.error(error);
    return error;
  }
});

ipcMain.handle('crypto:verify', async (_, password: string, hash: string) => {
  try {
    const res = await verifyPassword(password, hash, salt, saltRounds);
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
});
