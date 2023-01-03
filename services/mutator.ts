import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons';
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

export const deleteAccount = async (userId: string) => {
  try {
    await client.collection(COLLECTION.USERS).delete(userId);
    showNotification({
      title: 'Thao tác thành công',
      message: 'Tài khoản của bạn đã được xóa',
      color: 'teal',
      icon: IconCheck({
        size: 16,
      }),
    });
  } catch (error) {
    showNotification({
      title: 'Thao tác thất bại',
      message: 'Tài khoản chưa được xóa. Hãy thử lại nhé.',
      color: 'red',
      icon: IconAlertCircle({
        size: 16,
      }),
    });
  }
};
