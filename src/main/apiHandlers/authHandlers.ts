import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Consumer } from '../../entity/Consumer';
import { ILoginForm, IRegisterForm, LoginRes } from '../../renderer/types/auth';
import { hashPassword, verifyPassword } from '../util';
import { salt, saltRounds } from '../../constants/crypto';

ipcMain.handle('api:login', async (_, formData: ILoginForm) => {
  try {
    const user = await ds
      .createQueryBuilder()
      .select('Consumer')
      .from(Consumer, 'Consumer')
      .where('Consumer.username ILIKE :search', {
        search: `%${formData.login}%`,
      })
      .getOne();
    if (!user) return LoginRes.notFound;

    const res = await verifyPassword(
      formData.password,
      user.passwordHash,
      salt,
      saltRounds,
    );

    if (!res) return LoginRes.notFound;

    switch (user.isAdmin) {
      case true:
        return LoginRes.admin;
      case false:
        return LoginRes.user;
      default:
        return LoginRes.notFound;
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

    const res = await ds
      .createQueryBuilder()
      .insert()
      .into(Consumer)
      .values({ ...newUser })
      .execute();
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
});
