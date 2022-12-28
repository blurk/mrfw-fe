import { Record } from 'pocketbase';

export interface Genre extends Record {
  name: string;
  description: string;
}
