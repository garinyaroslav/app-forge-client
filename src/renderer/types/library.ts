export interface ILibrary {
  id: number;
  gameId: number;
  consumerId: number;
  addedDate: number;
}

export type TLibrary = 'id' | 'gameId' | 'consumerId' | 'addedDate';
