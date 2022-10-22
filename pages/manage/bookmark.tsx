import { Badge, Card, Group, List, Paper, ScrollArea, SimpleGrid, Text, Title, Image } from '@mantine/core';
import AppLoader from 'components/atoms/AppLoader';
import BookmarkButton from 'components/atoms/BookmarkButton';
import LikeButton from 'components/atoms/LikeButton';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { Suspense, useEffect } from 'react';
import { getBookmark } from 'services/fetchers';
import client from 'services/initPocketBase';
import useSWR, { useSWRConfig } from 'swr';
import { MangaStatusText, useSession } from 'utils';
import MangaStatusBadge from 'components/atoms/MangaStatusBadge';

type Props = {};

const BookmarkPage: NextPage<Props> = () => {
  const { user, isLoading } = useSession();

  const { mutate } = useSWRConfig();

  const profileId = user?.profile ? user.profile.id : null;

  const { data } = useSWR(profileId ? [profileId] : null, getBookmark, {
    isPaused: () => client.authStore.model == null,
    suspense: true,
  });

  useEffect(() => {
    if (!isLoading && (!user || !user.profile)) {
      Router.push('/login');
    }
  }, [user, isLoading]);

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Danh sách truyện theo dõi</title>
      </Head>

      <Title order={1} mt="md" color="gray.8">
        Danh sách truyện theo dõi
      </Title>

      <Paper mt="lg" p="sm">
        <SimpleGrid cols={3} spacing="lg">
          {data.map((manga) => (
            <Card shadow="sm" p="lg" radius="md" withBorder key={manga.id}>
              <Card.Section>
                <Image
                  src={client.records.getFileUrl(manga as any, manga.cover, { thumb: '0x160' })}
                  height={160}
                  alt={manga.title}
                />
              </Card.Section>

              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{manga.title}</Text>

                <MangaStatusBadge type={manga.status as keyof typeof MangaStatusText} />
              </Group>

              <Text size="sm" color="dimmed">
                {manga.description}
              </Text>
              <Group position="apart" align="start">
                <span>{manga.title}</span>

                <BookmarkButton mangaId={manga.id} />
                <LikeButton mangaId={manga.id} />
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Paper>
    </>
  );
};

const BookmarkPageWithSuspense = () => (
  <>
    <Suspense fallback={<AppLoader />}>
      <BookmarkPage />
    </Suspense>
  </>
);

export default BookmarkPageWithSuspense;
