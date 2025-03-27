export interface ILibrary {
  id: number;
  product: number;
  consumer: number;
  added_date: string;
}

export type TLibrary = 'id' | 'product' | 'consumer' | 'added_date';
