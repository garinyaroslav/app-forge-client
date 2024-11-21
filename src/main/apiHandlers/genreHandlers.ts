import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { GameGenre } from '../../entity/GameGenre';

ipcMain.handle('api:getGenres', async () => {
  try {
    const genres = await ds
      .createQueryBuilder()
      .select('GameGenre')
      .from(GameGenre, 'GameGenre')
      .getMany();
    return genres;
  } catch (error) {
    console.error(error);
    return false;
  }
});
