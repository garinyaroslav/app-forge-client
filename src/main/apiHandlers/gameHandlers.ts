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
      .orWhere('Game.title ILIKE :search', {
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

// SELECT "Game".*, "CartItem"."id" AS "cartItemId" FROM "Game" JOIN "CartItem" ON "Game"."id" = "CartItem"."gameId" WHERE "CartItem"."cartId" = (SELECT "id" FROM "Cart" WHERE "consumerId" = $1);
ipcMain.handle('api:getCartGamesByUserId', async (_, userId: number) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const games = await qr.query(
      `SELECT "Game".*, "CartItem"."id" AS "cartItemId" FROM "Game" JOIN "CartItem" ON "Game"."id" = "CartItem"."gameId" WHERE "CartItem"."cartId" = (SELECT "id" FROM "Cart" WHERE "consumerId" = $1);`,
      [userId],
    );

    await qr.commitTransaction();
    return games;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});

ipcMain.handle('api:deleteCartGamesByUserId', async (_, userId: number) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const games = await qr.query(
      `DELETE FROM "CartItem" WHERE "cartId" = (SELECT "id" FROM "Cart" WHERE "consumerId" = $1);`,
      [userId],
    );

    await qr.commitTransaction();
    return games;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});

// SELECT * FROM "Library" WHERE "consumerId" = 7 AND "gameId" = 13;
ipcMain.handle(
  'api:getGameFromUserLib',
  async (_, userId: number, gameId: number) => {
    const qr = await ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const games = await qr.query(
        `SELECT "id" FROM "Library" WHERE "consumerId" = $1 AND "gameId" = $2;`,
        [userId, gameId],
      );

      await qr.commitTransaction();
      return games;
    } catch (error) {
      await qr.rollbackTransaction();
      console.error(error);
      return false;
    } finally {
      await qr.release();
    }
  },
);

// SELECT "Game".*, "Library"."addedDate" AS "addedDate", "GameGenre"."genreName" AS "genreName" FROM "Game" JOIN "Library" ON "Game"."id" = "Library"."gameId" JOIN "GameGenre" ON "Game"."gameGenreId" = "GameGenre".id WHERE "Library"."consumerId" = 7;
ipcMain.handle('api:getGamesFromUserLib', async (_, userId: number) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const games = await qr.query(
      `SELECT "Game".*, "Library"."addedDate" AS "addedDate", "GameGenre"."genreName" AS "genreName" FROM "Game" JOIN "Library" ON "Game"."id" = "Library"."gameId" JOIN "GameGenre" ON "Game"."gameGenreId" = "GameGenre".id WHERE "Library"."consumerId" = $1;`,
      [userId],
    );

    await qr.commitTransaction();
    return games;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});

// SELECT * FROM "CartItem" WHERE "cartId" = (SELECT "id" FROM "Cart" WHERE "consumerId" = 7) AND "gameId" = 13
ipcMain.handle(
  'api:getGameFromUserCart',
  async (_, userId: number, gameId: number) => {
    const qr = await ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const games = await qr.query(
        `SELECT "id" FROM "CartItem" WHERE "cartId" = (SELECT "id" FROM "Cart" WHERE "consumerId" = $1) AND "gameId" = $2`,
        [userId, gameId],
      );

      await qr.commitTransaction();
      return games;
    } catch (error) {
      await qr.rollbackTransaction();
      console.error(error);
      return false;
    } finally {
      await qr.release();
    }
  },
);

// INSERT INTO "CartItem"("cartId", "gameId") VALUES ((SELECT "id" FROM "Cart" WHERE "consumerId" = 7), 14);
ipcMain.handle(
  'api:addGameInUserCart',
  async (_, userId: number, gameId: number) => {
    const qr = await ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const res = await qr.query(
        `INSERT INTO "CartItem"("cartId", "gameId") VALUES ((SELECT "id" FROM "Cart" WHERE "consumerId" = $1), $2);`,
        [userId, gameId],
      );

      await qr.commitTransaction();
      return res;
    } catch (error) {
      await qr.rollbackTransaction();
      console.error(error);
      return false;
    } finally {
      await qr.release();
    }
  },
);

ipcMain.handle('api:incGameCopiesSoldById', async (_, gameId: number) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const res = await qr.query(`CALL "IncGameCopiesSoldById"($1)`, [gameId]);

    await qr.commitTransaction();
    return res;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});

// SELECT R.*, C."firstName", C."lastName" FROM "Review" AS R JOIN "Consumer" AS C ON R."consumerId" = C."id" WHERE R."gameId" = 13;
ipcMain.handle('api:getReviewsByGameId', async (_, gameId: number) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const res = await qr.query(
      `SELECT R.*, C."firstName", C."lastName" FROM "Review" AS R JOIN "Consumer" AS C ON R."consumerId" = C."id" WHERE R."gameId" = $1;`,
      [gameId],
    );

    await qr.commitTransaction();
    return res;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});

ipcMain.handle(
  'api:getReviewByGameAndUserId',
  async (_, userId: number, gameId: number) => {
    const qr = await ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const games = await qr.query(
        `SELECT R.*, C."firstName", C."lastName" FROM "Review" AS R JOIN "Consumer" AS C ON R."consumerId" = C."id" WHERE R."gameId" = $1 AND R."consumerId" = $2;`,
        [gameId, userId],
      );

      await qr.commitTransaction();
      return games;
    } catch (error) {
      await qr.rollbackTransaction();
      console.error(error);
      return false;
    } finally {
      await qr.release();
    }
  },
);
