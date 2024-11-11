import { ipcMain } from 'electron';
import { dataSource as ds } from './db';
import { Game } from '../entity/Game';

ipcMain.handle('api:getGames', async () => {
  try {
    const games = await ds
      .createQueryBuilder()
      .select('Game')
      .from(Game, 'Game')
      .getMany();
    return games;
  } catch (error) {
    return error;
  }
});
