import { Record } from 'pocketbase';
import client from 'services/initPocketBase';
import { COLLECTION } from 'utils';
import { Manga } from './manga';
import { User } from './user';

export interface Comment extends Record {
  content: string;
  by: string;
  on: string;
  expand: {
    by: User;
    on: Manga;
  };
}

export const deleteComment = (commentId: string) => {
  return client.collection(COLLECTION.COMMENTS).delete(commentId);
};

export const updateComment = (commentId: string, commentBody: string) => {
  return client.collection(COLLECTION.COMMENTS).update(commentId, {
    content: commentBody,
  });
};
