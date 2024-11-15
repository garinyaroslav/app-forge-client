export interface IGameForm {
  id: number;
  title: string;
  description: string;
  developerName: string;
  rating: number;
  price: number;
  copiesSold: number;
  gameGenreId: number;
  relDate: string;
}

export type TGameForm =
  | 'title'
  | 'id'
  | 'description'
  | 'developerName'
  | 'rating'
  | 'price'
  | 'copiesSold'
  | 'gameGenreId'
  | 'relDate';
