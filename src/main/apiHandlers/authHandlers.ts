import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Consumer } from '../../entity/Consumer';
import { ILoginForm, LoginRes } from '../../renderer/types/auth';

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

    const res = false;
    // const res = await verifyPassword(
    //   formData.password,
    //   user.passwordHash,
    //   salt,
    //   iNum,
    // );

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
