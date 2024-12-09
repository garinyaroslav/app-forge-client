export interface IReview {
  id: number;
  rating: number;
  textComment: string;
  gameId: number;
  consumerId: number;
}

export interface IReviewObj {
  id: number;
  rating: number;
  textComment: string;
  gameId: number;
  consumerId: number;
  firstName: string;
  lastName: string;
}

export type TReview = 'id' | 'rating' | 'textComment' | 'gameId' | 'consumerId';
