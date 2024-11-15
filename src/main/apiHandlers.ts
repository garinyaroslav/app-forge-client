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

ipcMain.handle('api:getGame', async (_, gameId: number) => {
  try {
    console.log(gameId);
    const game = await ds
      .createQueryBuilder()
      .select('Game')
      .from(Game, 'Game')
      .where('Game.id = :gameId', { gameId })
      .getMany();
    return game;
  } catch (error) {
    return error;
  }
});
