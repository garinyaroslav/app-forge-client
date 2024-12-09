import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Consumer } from '../../entity/Consumer';
import { IConsumer, IProfileObj } from '../../renderer/types/consumer';

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
        .where('Consumer.username ILIKE :search', {
          search: `%${searchVal}%`,
        })
        .orWhere('Consumer.email ILIKE :search', {
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

ipcMain.handle('api:getProfile', async (_, userId: number) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const profile = await qr.query(
      `SELECT "firstName", "lastName", "regDate", "email" FROM "Consumer" WHERE "id" = $1;`,
      [userId],
    );

    await qr.commitTransaction();
    return profile;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});

ipcMain.handle('api:updateProfile', async (_, obj: IProfileObj) => {
  const qr = await ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const profile = await qr.query(
      `UPDATE "Consumer" SET "email"=$1, "firstName"=$2, "lastName"=$3 WHERE "id" = $4;`,
      [obj.email, obj.firstName, obj.lastName, obj.id],
    );

    await qr.commitTransaction();
    return profile;
  } catch (error) {
    await qr.rollbackTransaction();
    console.error(error);
    return false;
  } finally {
    await qr.release();
  }
});
