// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IGameReqObj } from '../renderer/types/gameReqObj';
import { IGenre } from '../renderer/types/genre';
import { IConsumer } from '../renderer/types/consumer';
import { IReview } from '../renderer/types/review';
import { ILibrary } from '../renderer/types/library';
import { ICart } from '../renderer/types/cart';
import { ICartItem } from '../renderer/types/cartItem';
import { ILoginForm, IRegisterForm } from '../renderer/types/auth';
import { GameSort } from '../renderer/types/game';

const apiHandler = {
  getGames: () => ipcRenderer.invoke('api:getGames'),
  getGame: (gameId: number) => ipcRenderer.invoke('api:getGame', gameId),
  deleteGame: (gameId: number) => ipcRenderer.invoke('api:deleteGame', gameId),
  addGame: (game: IGameReqObj) => ipcRenderer.invoke('api:addGame', game),
  updateGame: (game: IGameReqObj) => ipcRenderer.invoke('api:updateGame', game),
  getGamesBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getGamesBySearchValue', val),
  getGamesList: (sort: GameSort, search: string) =>
    ipcRenderer.invoke('api:getGamesList', sort, search),
  getGamesListElem: (gameId: number) =>
    ipcRenderer.invoke('api:getGamesListElem', gameId),

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
  updateReview: (review: IReview) =>
    ipcRenderer.invoke('api:updateReview', review),
  getReviewsBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getReviewsBySearchValue', val),

  getLibraries: () => ipcRenderer.invoke('api:getLibraries'),
  getLibrary: (libId: number) => ipcRenderer.invoke('api:getLibrary', libId),
  deleteLibrary: (libId: number) =>
    ipcRenderer.invoke('api:deleteLibrary', libId),
  addLibrary: (lib: ILibrary) => ipcRenderer.invoke('api:addLibrary', lib),
  updateLibrary: (lib: ILibrary) =>
    ipcRenderer.invoke('api:updateLibrary', lib),
  getLibrariesBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getLibrariesBySearchValue', val),

  getCarts: () => ipcRenderer.invoke('api:getCarts'),
  getCart: (cartId: number) => ipcRenderer.invoke('api:getCart', cartId),
  deleteCart: (cartId: number) => ipcRenderer.invoke('api:deleteCart', cartId),
  addCart: (cart: ICart) => ipcRenderer.invoke('api:addCart', cart),
  updateCart: (cart: ICart) => ipcRenderer.invoke('api:updateCart', cart),
  getCartsBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getCartsBySearchValue', val),

  getCartItems: () => ipcRenderer.invoke('api:getCartItems'),
  getCartItem: (cartItemId: number) =>
    ipcRenderer.invoke('api:getCartItem', cartItemId),
  deleteCartItem: (cartItemId: number) =>
    ipcRenderer.invoke('api:deleteCartItem', cartItemId),
  addCartItem: (cartItem: ICartItem) =>
    ipcRenderer.invoke('api:addCartItem', cartItem),
  updateCartItem: (cartItem: ICartItem) =>
    ipcRenderer.invoke('api:updateCartItem', cartItem),
  getCartItemsBySearchValue: (val: string) =>
    ipcRenderer.invoke('api:getCartItemsBySearchValue', val),

  login: (formData: ILoginForm) => ipcRenderer.invoke('api:login', formData),
  register: (formData: IRegisterForm) =>
    ipcRenderer.invoke('api:register', formData),
};

contextBridge.exposeInMainWorld('api', apiHandler);
