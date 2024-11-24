import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { CartItem } from '../../entity/CartItem';
import { ICartItem } from '../../renderer/types/cartItem';

ipcMain.handle('api:getCartItems', async () => {
  try {
    const cartItems = await ds
      .createQueryBuilder()
      .select('CartItem')
      .from(CartItem, 'CartItem')
      .orderBy('CartItem.id', 'ASC')
      .getMany();
    return cartItems;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getCartItem', async (_, cartItemId: number) => {
  try {
    const cartItem = await ds
      .createQueryBuilder()
      .select('CartItem')
      .from(CartItem, 'CartItem')
      .where('CartItem.id = :cartItemId', { cartItemId })
      .getMany();
    return cartItem;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addCartItem', async (_, newCartItem: ICartItem) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(CartItem)
      .values({ ...newCartItem })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteCartItem', async (_, cartItemId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(CartItem)
      .where('id = :id', { id: cartItemId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateCartItem', async (_, newCartItem: ICartItem) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(CartItem)
      .set(newCartItem)
      .where('id = :id', { id: newCartItem.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle(
  'api:getCartItemsBySearchValue',
  async (_, searchVal: string) => {
    try {
      const cartItems = await ds
        .createQueryBuilder()
        .select('CartItem')
        .from(CartItem, 'CartItem')
        .where('CAST(CartItem.id AS TEXT) LIKE :search', {
          search: `%${searchVal}%`,
        })
        .getMany();
      return cartItems;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
);
