import { ipcMain } from 'electron';
import { dataSource as ds } from './db';
import { Game } from '../entity/Game';
import { IGameReqObj } from '../renderer/types/gameReqObj';

ipcMain.handle('api:getGames', async () => {
  try {
    const games = await ds
      .createQueryBuilder()
      .select('Game')
      .from(Game, 'Game')
      .getMany();
    return games;
  } catch (error) {
    console.error(error);
    return false;
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
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteGame', async (_, gameId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(Game)
      .where('id = :id', { id: gameId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addGame', async (_, newGame: IGameReqObj) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(Game)
      .values({ ...newGame })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateGame', async (_, newGame: IGameReqObj) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(Game)
      .set(newGame)
      .where('id = :id', { id: newGame.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

// ipcMain.handle('api:getGamesBySearchValue', async (_, searchVal: string) => {
//   try {
//     return await ds
//       .createQueryBuilder()
//       .update(Game)
//       .set(newGame)
//       .where('id = :id', { id: newGame.id })
//       .execute();
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// });
