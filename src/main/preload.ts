// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IGameReqObj } from '../renderer/types/gameReqObj';
import { IGenre } from '../renderer/types/genre';

const apiHandler = {
  getGames: () => ipcRenderer.invoke('api:getGames'),
  getGame: (gameId: number) => ipcRenderer.invoke('api:getGame', gameId),
  deleteGame: (gameId: number) => ipcRenderer.invoke('api:deleteGame', gameId),
  addGame: (game: IGameReqObj) => ipcRenderer.invoke('api:addGame', game),
  updateGame: (game: IGameReqObj) => ipcRenderer.invoke('api:updateGame', game),
  getGamesBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getGamesBySearchValue', val),
  getGenres: () => ipcRenderer.invoke('api:getGenres'),
  getGenre: (genreId: number) => ipcRenderer.invoke('api:getGenre', genreId),
  addGenre: (genre: IGenre) => ipcRenderer.invoke('api:addGenre', genre),
  deleteGenre: (genreId: number) =>
    ipcRenderer.invoke('api:deleteGenre', genreId),
};

contextBridge.exposeInMainWorld('api', apiHandler);
