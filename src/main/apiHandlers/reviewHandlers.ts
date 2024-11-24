import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { Review } from '../../entity/Review';
import { IReview } from '../../renderer/types/review';

ipcMain.handle('api:getReviews', async () => {
  try {
    const reviews = await ds
      .createQueryBuilder()
      .select('Review')
      .from(Review, 'Review')
      .orderBy('Review.id', 'ASC')
      .getMany();
    return reviews;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getReview', async (_, rewId: number) => {
  try {
    const review = await ds
      .createQueryBuilder()
      .select('Review')
      .from(Review, 'Review')
      .where('Review.id = :rewId', { rewId })
      .getMany();
    return review;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addReview', async (_, newReview: IReview) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(Review)
      .values({ ...newReview })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteReview', async (_, rewId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(Review)
      .where('id = :id', { id: rewId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateReview', async (_, newReview: IReview) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(Review)
      .set(newReview)
      .where('id = :id', { id: newReview.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getReviewsBySearchValue', async (_, searchVal: string) => {
  try {
    const reviews = await ds
      .createQueryBuilder()
      .select('Review')
      .from(Review, 'Review')
      .where('Review.textComment ILIKE :search', {
        search: `%${searchVal}%`,
      })
      .orWhere('CAST(Review.id AS TEXT) LIKE :search', {
        search: `%${searchVal}%`,
      })
      .getMany();
    return reviews;
  } catch (error) {
    console.error(error);
    return false;
  }
});
