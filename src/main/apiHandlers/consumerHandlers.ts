import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Consumer } from '../../entity/Consumer';
import { IConsumer } from '../../renderer/types/consumer';

ipcMain.handle('api:getConsumers', async () => {
  try {
    const consumers = await ds
      .createQueryBuilder()
      .select('Consumer')
      .from(Consumer, 'Consumer')
      .orderBy('Consumer.id', 'ASC')
      .getMany();
    return consumers;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getConsumer', async (_, conId: number) => {
  try {
    const consumer = await ds
      .createQueryBuilder()
      .select('Consumer')
      .from(Consumer, 'Consumer')
      .where('Consumer.id = :conId', { conId })
      .getMany();
    return consumer;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addConsumer', async (_, newConsumer: IConsumer) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(Consumer)
      .values({ ...newConsumer })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteConsumer', async (_, conId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(Consumer)
      .where('id = :id', { id: conId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateConsumer', async (_, newConsumer: IConsumer) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(Consumer)
      .set(newConsumer)
      .where('id = :id', { id: newConsumer.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle(
  'api:getConsumersBySearchValue',
  async (_, searchVal: string) => {
    try {
      const consumers = await ds
        .createQueryBuilder()
        .select('Consumer')
        .from(Consumer, 'Consumer')
        .where('Consumer.genreName ILIKE :search', {
          search: `%${searchVal}%`,
        })
        .orWhere('CAST(Consumer.id AS TEXT) LIKE :search', {
          search: `%${searchVal}%`,
        })
        .getMany();
      return consumers;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
);
