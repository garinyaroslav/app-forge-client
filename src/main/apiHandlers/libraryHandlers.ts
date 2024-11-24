import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Library } from '../../entity/Library';
import { ILibrary } from '../../renderer/types/library';

ipcMain.handle('api:getLibrarys', async () => {
  try {
    const librarys = await ds
      .createQueryBuilder()
      .select('Library')
      .from(Library, 'Library')
      .orderBy('Library.id', 'ASC')
      .getMany();
    return librarys;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getLibrary', async (_, libId: number) => {
  try {
    const library = await ds
      .createQueryBuilder()
      .select('Library')
      .from(Library, 'Library')
      .where('Library.id = :libId', { libId })
      .getMany();
    return library;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addLibrary', async (_, newLibrary: ILibrary) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(Library)
      .values({ ...newLibrary })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteLibrary', async (_, libId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(Library)
      .where('id = :id', { id: libId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateLibrary', async (_, newLibrary: ILibrary) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(Library)
      .set(newLibrary)
      .where('id = :id', { id: newLibrary.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getLibrarysBySearchValue', async (_, searchVal: string) => {
  try {
    const librarys = await ds
      .createQueryBuilder()
      .select('Library')
      .from(Library, 'Library')
      .where('CAST(Library.id AS TEXT) LIKE :search', {
        search: `%${searchVal}%`,
      })
      .getMany();
    return librarys;
  } catch (error) {
    console.error(error);
    return false;
  }
});
