import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconEye } from '@tabler/icons';
import { Chapter, Manga } from 'domains';
import Link from 'next/link';
import { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { useEffect } from 'react';
import client from 'services/initPocketBase';
import { COLLECTION } from 'utils/collections';
import { Routes } from 'utils/routes';
import { useSession } from './useSession';

export function useOnNewChapterAdded() {
  const { user } = useSession();

  useEffect(() => {
    client.autoCancellation(false);

    const onNewChapterAdded = async (newChapter: Chapter) => {
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
              >
                Đọc ngay
              </Button>
            ),
            autoClose: 5000,
          });

          try {
            await client.collection(COLLECTION.NOTIFICATIONS).create({
              isRead: false,
              of_chapter: newChapter.id,
              of_user: user.id,
            });
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    let unsubscribe: UnsubscribeFunc | undefined = undefined;

    const subscribe = async () => {
      unsubscribe = await client
        .collection(COLLECTION.CHAPTER)
        .subscribe('*', function (e: RecordSubscription<Chapter>) {
          if (e.action === 'create') {
            onNewChapterAdded(e.record);
          }
        });
    };

    subscribe();

    const cleanUp = async () => {
      unsubscribe && (await unsubscribe());
    };

    return () => {
      cleanUp();
    };
  }, [user]);
}
