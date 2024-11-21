// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IGameReqObj } from '../renderer/types/gameReqObj';

const apiHandler = {
  getGames: () => ipcRenderer.invoke('api:getGames'),
  getGame: (gameId: number) => ipcRenderer.invoke('api:getGame', gameId),
  deleteGame: (gameId: number) => ipcRenderer.invoke('api:deleteGame', gameId),
  addGame: (game: IGameReqObj) => ipcRenderer.invoke('api:addGame', game),
  updateGame: (game: IGameReqObj) => ipcRenderer.invoke('api:updateGame', game),
  getGamesBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getGamesBySearchValue', val),
  getGenres: () => ipcRenderer.invoke('api:getGenres'),
};

contextBridge.exposeInMainWorld('api', apiHandler);
