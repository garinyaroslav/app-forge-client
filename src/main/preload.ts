// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';

const apiHandler = {};

contextBridge.exposeInMainWorld('api', apiHandler);
