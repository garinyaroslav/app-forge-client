// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IGameReqObj } from '../renderer/types/gameReqObj';
import { IGenre } from '../renderer/types/genre';
import { IConsumer } from '../renderer/types/consumer';

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
  updateGenre: (genre: IGenre) => ipcRenderer.invoke('api:updateGenre', genre),
  getGenresBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getGenresBySearchValue', val),

  getConsumers: () => ipcRenderer.invoke('api:getConsumers'),
  getConsumer: (conId: number) => ipcRenderer.invoke('api:getConsumer', conId),
  addConsumer: (con: IConsumer) => ipcRenderer.invoke('api:addConsumer', con),
  deleteConsumer: (conId: number) =>
    ipcRenderer.invoke('api:deleteConsumer', conId),
  updateConsumer: (consumer: IConsumer) =>
    ipcRenderer.invoke('api:updateConsumer', consumer),
  getConsumersBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getConsumersBySearchValue', val),
};

contextBridge.exposeInMainWorld('api', apiHandler);
