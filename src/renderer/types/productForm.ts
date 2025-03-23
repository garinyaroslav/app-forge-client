export interface IProductForm {
  id: number;
  title: string;
  description: string;
  developer_name: string;
  rating: number;
  price: number;
  copies_sold: number;
  genre: number;
  rel_date: string;
  image: FileList;
}

export type TProductForm =
  | 'title'
  | 'id'
  | 'description'
  | 'developer_name'
  | 'rating'
  | 'price'
  | 'copies_sold'
  | 'genre'
  | 'rel_date';
