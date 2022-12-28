import { User } from 'domains';
import { COLLECTION } from 'utils';
import client from './initPocketBase';

export const updateBookmark = (mangaId: string, isBookmarked = false, user: User) => {
  const bookmarks = user.bookmark as string[];

  return client.collection(COLLECTION.USERS).update(user.id, {
    bookmark: isBookmarked
      ? bookmarks.filter((bm) => bm !== mangaId) // Remove
      : [...bookmarks, mangaId],
  });
};

export const updateLiked = (mangaId: string, isLiked = false, user: User) => {
  const likedList = user.liked as string[];

  return client.collection(COLLECTION.USERS).update(user.id, {
    liked: isLiked
      ? likedList.filter((manga) => manga !== mangaId) // Remove
      : [...likedList, mangaId],
  });
};
