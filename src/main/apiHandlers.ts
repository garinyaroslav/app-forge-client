import { ipcMain } from 'electron';
import { dataSource } from './db';
import { Game } from '../entity/Game';

ipcMain.handle('api:getGames', async () => {
  try {
    const games = await dataSource.getRepository(Game).find();
    return games;
  } catch (error) {
    return error;
  }
});
