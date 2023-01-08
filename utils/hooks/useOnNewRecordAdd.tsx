import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconEye } from '@tabler/icons';
import { Chapter, Comment, Manga, User } from 'domains';
import Link from 'next/link';
import { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { useEffect } from 'react';
import client from 'services/initPocketBase';
import { COLLECTION } from 'utils/collections';
import { Routes } from 'utils/routes';
import { useSession } from './useSession';
import useSwr, { useSWRConfig } from 'swr';
import { SWR_USER_KEY } from 'utils/swrKeys';
import { markAsRead, Notification, NotificationCreate } from 'domains/notifications';

export function useOnNewRecordAdd() {
  const { user } = useSession();
  const { mutate, cache } = useSWRConfig();

  useEffect(() => {
    client.autoCancellation(false);

    const onButtonClick = (recordId: string, userId: string, type: Notification['type']) => {
      const notiList = cache.get(SWR_USER_KEY.NOTIFICATION)?.data as Notification[] | undefined;
      if (notiList) {
        let neededItem = undefined;

        if (type === 'new_chapter') {
          neededItem = notiList.find((item) => item.of_user === userId && item.of_chapter === recordId);
        } else {
          neededItem = notiList.find((item) => item.of_user === userId && item.of_manga === recordId);
        }

        if (neededItem) {
          markAsRead(neededItem.id)
            .then(() => {
              mutate(SWR_USER_KEY.NOTIFICATION);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    };

    const onNewChapterAdd = async (newChapter: Chapter) => {
      if (!user) {
        return;
      }

      if (user.bookmark.includes(newChapter.belong_to)) {
        try {
          const manga = await client.collection(COLLECTION.MANGAS).getOne<Manga>(newChapter.belong_to);

          showNotification({
            title: `${manga.title} vừa mới có chương mới: ${newChapter.name}`,
            message: (
              <Button
                component={Link}
                href={`${Routes.MANGA_CHAPTER}${newChapter.id}`}
                leftIcon={<IconEye size={16} />}
                size="xs"
                mt={4}
                onClick={() => onButtonClick(newChapter.id, user.id, 'new_chapter')}
              >
                Đọc ngay
              </Button>
            ),
            autoClose: 5000,
          });

          try {
            await client.collection(COLLECTION.NOTIFICATIONS).create<NotificationCreate>({
              isRead: false,
              of_chapter: newChapter.id,
              of_manga: '',
              of_user: user.id,
              type: 'new_chapter',
            });
            mutate(SWR_USER_KEY.NOTIFICATION);
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const onNewCommentAdd = async (newComment: Comment) => {
      if (!user || user.id === newComment.by) {
        return;
      }

      if (user.id) {
        try {
          const _newComment = await client.collection(COLLECTION.COMMENTS).getOne<Comment>(newComment.id, {
            expand: 'on,by',
          });

          if (_newComment.expand.on.upload_by !== user.id) {
            return;
          }

          showNotification({
            title: `${_newComment.expand.by.name} vừa bình luận trên truyện của bạn: ${_newComment.expand.on.title}`,
            message: (
              <Button
                component={Link}
                href={`${Routes.MANGA}${_newComment.expand.on.id}`}
                leftIcon={<IconEye size={16} />}
                size="xs"
                mt={4}
                onClick={() => onButtonClick(_newComment.on, user.id, 'new_comment')}
              >
                Xem ngay
              </Button>
            ),
            autoClose: 5000,
          });

          try {
            await client.collection(COLLECTION.NOTIFICATIONS).create<NotificationCreate>({
              isRead: false,
              of_chapter: '',
              of_manga: _newComment.on,
              of_user: user.id,
              type: 'new_comment',
            });
            mutate(SWR_USER_KEY.NOTIFICATION);
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    let unsubscribeChapter: UnsubscribeFunc | undefined = undefined;
    let unsubscribeComment: UnsubscribeFunc | undefined = undefined;

    const subscribe = async () => {
      unsubscribeChapter = await client
        .collection(COLLECTION.CHAPTER)
        .subscribe('*', function (e: RecordSubscription<Chapter>) {
          if (e.action === 'create') {
            onNewChapterAdd(e.record);
          }
        });

      unsubscribeComment = await client
        .collection(COLLECTION.COMMENTS)
        .subscribe('*', function (e: RecordSubscription<Comment>) {
          if (e.action === 'create') {
            onNewCommentAdd(e.record);
          }
        });
    };

    subscribe();

    const cleanUp = async () => {
      unsubscribeChapter && (await unsubscribeChapter());
      unsubscribeComment && (await unsubscribeComment());
    };

    return () => {
      cleanUp();
    };
  }, [user, mutate, cache]);
}
