import { Record } from 'pocketbase';

export interface Rating extends Record {
  like: boolean;
  by: string;
  on_manga: string;
}
