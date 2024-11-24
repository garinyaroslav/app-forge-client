export interface IReview {
  id: number;
  rating: number;
  textComment: string;
  gameId: number;
  consumerId: number;
}

export type TReview = 'id' | 'rating' | 'textComment' | 'gameId' | 'consumerId';
