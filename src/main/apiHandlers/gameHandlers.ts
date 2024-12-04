import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Game } from '../../entity/Game';
import { IGameReqObj } from '../../renderer/types/gameReqObj';

ipcMain.handle('api:getGames', async () => {
  try {
    const games = await ds
      .createQueryBuilder()
      .select('Game')
      .from(Game, 'Game')
      .orderBy('Game.id', 'ASC')
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

ipcMain.handle('api:getGamesBySearchValue', async (_, searchVal: string) => {
  try {
    const games = await ds
      .createQueryBuilder()
      .select('Game')
      .from(Game, 'Game')
      .where('Game.title ILIKE :search', { search: `%${searchVal}%` })
      .orWhere('CAST(Game.id AS TEXT) ILIKE :search', {
        search: `%${searchVal}%`,
      })
      .getMany();
    return games;
  } catch (error) {
    console.error(error);
    return false;
  }
});

// SELECT game.*, genre."genreName" FROM "Game" AS game JOIN "GameGenre" AS genre ON genre.id = game."gameGenreId";
ipcMain.handle('api:getGamesList', async (_, sort, search: string) => {
  try {
    let gamesWithGenres;
    if (search.length > 0)
      gamesWithGenres = await ds
        .getRepository(Game)
        .createQueryBuilder('game')
        .innerJoinAndSelect('game.gameGenres', 'genre')
        .select(['game', 'genre.genreName'])
        .where('game.title ILIKE :search', {
          search: `%${search}%`,
        })
        .orderBy(`game.${sort}`, 'DESC')
        .getMany();
    else
      gamesWithGenres = await ds
        .getRepository(Game)
        .createQueryBuilder('game')
        .innerJoinAndSelect('game.gameGenres', 'genre')
        .select(['game', 'genre.genreName'])
        .orderBy(`game.${sort}`, 'DESC')
        .getMany();
    return gamesWithGenres;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getGamesListElem', async (_, gameId: number) => {
  try {
    const gameWithGenres = await ds
      .getRepository(Game)
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.gameGenres', 'genre')
      .select(['game', 'genre.genreName'])
      .where('game.id = :gameId', { gameId })
      .getMany();
    return gameWithGenres;
  } catch (error) {
    console.error(error);
    return false;
  }
});
