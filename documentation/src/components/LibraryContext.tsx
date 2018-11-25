import React from 'react';
import { Library } from '../types';

export const LibraryContext: React.Context<Library> = React.createContext({});
export const IsJurisMContext: React.Context<boolean> = React.createContext(false);

export const ZoteroOrJurisM = () =>
  <IsJurisMContext.Consumer children={value => value ? 'Juris-M' : 'Zotero'} />;

