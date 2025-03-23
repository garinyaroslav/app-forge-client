export interface IProduct {
  id: number;
  title: string;
  description: string;
  developer_name: string;
  rating: number;
  price: number;
  copies_sold: number;
  genre: number;
  rel_date: string;
  image: string;
  // reviews: undefined;
  // libraries: undefined;
  // cartItems: undefined;
  // gameGeneres: undefined;
}

export interface ILibProduct {
  id: number;
  title: string;
  description: string;
  developer_name: string;
  rating: number;
  price: number;
  copies_sold: number;
  genre: number;
  rel_date: string;
  image: string;
  added_date: number;
  genre_name: string;
}

export enum ProductSort {
  byPopularity = 'copiesSold',
  byNovelty = 'relDate',
}
