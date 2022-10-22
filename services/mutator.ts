import { Record, User } from 'pocketbase';
import client from './initPocketBase';

export const updateBookmark = (mangaId: string, isBookmarked = false, user: User) => {
  const profile = user.profile as Record;
  const bookmarks = user.profile!.bookmark as string[];

  return client.records.update('profiles', profile.id, {
    bookmark: isBookmarked
      ? bookmarks.filter((bm) => bm !== mangaId) // Remove
      : [...bookmarks, mangaId],
  });
};

export const updateLiked = (mangaId: string, isLiked = false, user: User) => {
  const profile = user.profile as Record;
  const likedList = user.profile!.liked as string[];

  return client.records.update('profiles', profile.id, {
    liked: isLiked
      ? likedList.filter((manga) => manga !== mangaId) // Remove
      : [...likedList, mangaId],
  });
};
