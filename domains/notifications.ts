import { Record } from 'pocketbase';
import { Chapter } from './chapter';

export interface Notification extends Record {
  isRead: boolean;
  of_user: string;
  of_chapter: string;
  expand: {
    of_chapter: Chapter;
  };
}
