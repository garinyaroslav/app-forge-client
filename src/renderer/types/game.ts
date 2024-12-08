export interface IGame {
  id: number;
  title: string;
  description: string;
  developerName: string;
  rating: number;
  price: number;
  copiesSold: number;
  gameGenreId: number;
  relDate: number;
  image: Uint8Array;
  reviews: undefined;
  libraries: undefined;
  cartItems: undefined;
  gameGeneres: undefined;
}

export interface ILibGame {
  id: number;
  title: string;
  description: string;
  developerName: string;
  rating: number;
  price: number;
  copiesSold: number;
  gameGenreId: number;
  relDate: number;
  image: Uint8Array;
  addedDate: number;
  genreName: string;
}

export enum GameSort {
  byPopularity = 'copiesSold',
  byNovelty = 'relDate',
}
