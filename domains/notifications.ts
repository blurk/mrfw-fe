import { Record } from 'pocketbase';
import client from 'services/initPocketBase';
import { COLLECTION } from 'utils';
import { Chapter } from './chapter';
import { Comment } from './comment';
import { Manga } from './manga';
import { User } from './user';

export interface Notification extends Record {
  isRead: boolean;
  of_user: string;
  of_chapter: string;
  of_manga: string;
  of_comment: string;
  type: 'new_chapter' | 'new_comment';
  expand: {
    of_chapter: Chapter;
    of_manga: Manga;
    of_user: User;
    of_comment: Comment;
  };
}

export interface NotificationCreate
  extends Pick<Notification, 'isRead' | 'of_user' | 'of_chapter' | 'type' | 'of_manga' | 'of_comment'> {}

export const markAsRead = (notiId: string) => {
  return client.collection(COLLECTION.NOTIFICATIONS).update(notiId, {
    isRead: true,
  });
};

export const removeNotification = (notiId: string) => {
  return client.collection(COLLECTION.NOTIFICATIONS).delete(notiId);
};
