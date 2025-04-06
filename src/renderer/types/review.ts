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
  product_id: number;
  consumer: number;
  consumer__first_name: string;
  consumer__last_name: string;
}

export type TReview = 'id' | 'rating' | 'text_comment' | 'product' | 'consumer';
