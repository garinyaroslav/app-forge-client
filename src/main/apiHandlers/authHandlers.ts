import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Consumer } from '../../entity/Consumer';
import { ILoginForm, IRegisterForm, LoginRes } from '../../renderer/types/auth';
import { hashPassword, verifyPassword } from '../util';
import { salt, saltRounds } from '../../constants/crypto';
import { Cart } from '../../entity/Cart';

ipcMain.handle('api:login', async (_, formData: ILoginForm) => {
  try {
    const user = await ds
      .createQueryBuilder()
      .select('Consumer')
      .from(Consumer, 'Consumer')
      .where('Consumer.username = :search', {
        search: formData.login,
      })
      .getOne();

    const failObj = { status: LoginRes.notFound, uid: null };
    if (!user) return failObj;

    const res = await verifyPassword(
      formData.password,
      user.passwordHash,
      salt,
      saltRounds,
    );

    if (!res) return failObj;

    switch (user.isAdmin) {
      case true:
        return { status: LoginRes.admin, uid: user.id };
      case false:
        return { status: LoginRes.user, uid: user.id };
      default:
        return failObj;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:register', async (_, formData: IRegisterForm) => {
  try {
    const passwordHash = await hashPassword(
      formData.password,
      salt,
      saltRounds,
    );

    const newUser = {
      username: formData.login,
      email: formData.email,
      passwordHash,
      firstName: formData.fname,
      lastName: formData.lname,
      regDate: Math.floor(Date.now() / 1000),
      isAdmin: false,
    };

    const userRes = await ds
      .createQueryBuilder()
      .insert()
      .into(Consumer)
      .values({ ...newUser })
      .execute();

    const newUserId = userRes.identifiers[0].id;

    await ds
      .createQueryBuilder()
      .insert()
      .into(Cart)
      .values({ consumerId: newUserId })
      .execute();

    return newUserId;
  } catch (error) {
    console.error(error);
    return false;
  }
});
