import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Cart } from '../../entity/Cart';
import { ICart } from '../../renderer/types/cart';

ipcMain.handle('api:getCarts', async () => {
  try {
    const carts = await ds
      .createQueryBuilder()
      .select('Cart')
      .from(Cart, 'Cart')
      .orderBy('Cart.id', 'ASC')
      .getMany();
    return carts;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getCart', async (_, cartId: number) => {
  try {
    const cart = await ds
      .createQueryBuilder()
      .select('Cart')
      .from(Cart, 'Cart')
      .where('Cart.id = :cartId', { cartId })
      .getMany();
    return cart;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addCart', async (_, newCart: ICart) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(Cart)
      .values({ ...newCart })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteCart', async (_, cartId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(Cart)
      .where('id = :id', { id: cartId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateCart', async (_, newCart: ICart) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(Cart)
      .set(newCart)
      .where('id = :id', { id: newCart.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getCartsBySearchValue', async (_, searchVal: string) => {
  try {
    const carts = await ds
      .createQueryBuilder()
      .select('Cart')
      .from(Cart, 'Cart')
      .where('CAST(Cart.id AS TEXT) LIKE :search', {
        search: `%${searchVal}%`,
      })
      .getMany();
    return carts;
  } catch (error) {
    console.error(error);
    return false;
  }
});
