// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IGameReqObj } from '../renderer/types/gameReqObj';
import { IGenre } from '../renderer/types/genre';
import { IConsumer } from '../renderer/types/consumer';
import { IReview } from '../renderer/types/review';
import { ILibrary } from '../renderer/types/library';

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
  deleteGenre: (genreId: number) =>
    ipcRenderer.invoke('api:deleteGenre', genreId),
  addGenre: (genre: IGenre) => ipcRenderer.invoke('api:addGenre', genre),
  updateGenre: (genre: IGenre) => ipcRenderer.invoke('api:updateGenre', genre),
  getGenresBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getGenresBySearchValue', val),

  getConsumers: () => ipcRenderer.invoke('api:getConsumers'),
  getConsumer: (conId: number) => ipcRenderer.invoke('api:getConsumer', conId),
  deleteConsumer: (conId: number) =>
    ipcRenderer.invoke('api:deleteConsumer', conId),
  addConsumer: (con: IConsumer) => ipcRenderer.invoke('api:addConsumer', con),
  updateConsumer: (consumer: IConsumer) =>
    ipcRenderer.invoke('api:updateConsumer', consumer),
  getConsumersBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getConsumersBySearchValue', val),

  getReviews: () => ipcRenderer.invoke('api:getReviews'),
  getReview: (rewId: number) => ipcRenderer.invoke('api:getReview', rewId),
  deleteReview: (rewId: number) =>
    ipcRenderer.invoke('api:deleteReview', rewId),
  addReview: (rew: IReview) => ipcRenderer.invoke('api:addReview', rew),
  updateReview: (consumer: IReview) =>
    ipcRenderer.invoke('api:updateReview', consumer),
  getReviewsBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getReviewsBySearchValue', val),

  getLibrarys: () => ipcRenderer.invoke('api:getLibrarys'),
  getLibrary: (libId: number) => ipcRenderer.invoke('api:getLibrary', libId),
  deleteLibrary: (libId: number) =>
    ipcRenderer.invoke('api:deleteLibrary', libId),
  addLibrary: (lib: ILibrary) => ipcRenderer.invoke('api:addLibrary', lib),
  updateLibrary: (consumer: ILibrary) =>
    ipcRenderer.invoke('api:updateLibrary', consumer),
  getLibrarysBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getLibrarysBySearchValue', val),
};

contextBridge.exposeInMainWorld('api', apiHandler);
