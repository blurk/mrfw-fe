import { Record } from 'pocketbase';

export interface View extends Record {
  count: number;
  manga: string;
}
