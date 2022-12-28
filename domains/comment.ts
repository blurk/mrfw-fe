import { Record } from 'pocketbase';

export interface Comment extends Record {
  content: string;
  by: string;
}
