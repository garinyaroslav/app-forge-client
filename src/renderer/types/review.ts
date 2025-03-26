export interface IReview {
  id: number;
  rating: number;
  text_comment: string;
  product: number;
  consumer: number;
}

export interface IReviewObj {
  id: number;
  rating: number;
  text_comment: string;
  product: number;
  consumer: number;
  first_name: string;
  last_name: string;
}

export type TReview = 'id' | 'rating' | 'text_comment' | 'product' | 'consumer';
