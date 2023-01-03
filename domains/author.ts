import { Record } from 'pocketbase';

export interface Author extends Record {
  name: string;
  mangas: string[];
}
