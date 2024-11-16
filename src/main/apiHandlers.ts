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

ipcMain.handle('api:deleteGame', async (_, gameId: number) => {
  try {
    await ds
      .createQueryBuilder()
      .delete()
      .from(Game)
      .where('id = :id', { id: gameId })
      .execute();
    return true;
  } catch (error) {
    return error;
  }
});
