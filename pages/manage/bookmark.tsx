import { Player } from '@lottiefiles/react-lottie-player';
import { Anchor, Button, Card, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconEye } from '@tabler/icons';
import BookmarkButton from 'components/atoms/BookmarkButton';
import WithSuspense from 'components/atoms/WithSuspense';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect } from 'react';
import { getBookmark } from 'services/fetchers';
import client from 'services/initPocketBase';
import useSWR from 'swr';
import { useSession } from 'utils';
import { Routes } from 'utils/routes';

type Props = {};

const BookmarkPage: NextPage<Props> = () => {
  const { user, isLoading } = useSession();
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
    <WithSuspense>
      <Head>
        <title>Danh sách truyện theo dõi</title>
      </Head>

      <Title order={1} mt="md" color="gray.8">
        Danh sách truyện theo dõi
      </Title>

      {data.length > 0 ? (
        <SimpleGrid cols={3} spacing="xl" mt="md">
          {data.map((manga) => (
            <Card shadow="sm" p="lg" radius="md" withBorder key={manga.id}>
              <Card.Section>
                <Image
                  src={client.records.getFileUrl(manga as any, manga.cover, { thumb: '300x100' })}
                  height={100}
                  alt={manga.title}
                />
              </Card.Section>

              <Title lineClamp={1} order={3} size="xl" color="blue" mt="sm">
                {manga.title}
              </Title>

              <Text lineClamp={3} sx={{ height: '5em' }}>
                {manga.description}
              </Text>

              <Group mt={'sm'}>
                <BookmarkButton mangaId={manga.id} />

                <Link href={'/manga/' + manga.id} passHref>
                  <Button leftIcon={<IconEye size={18} />}>Đọc</Button>
                </Link>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Paper p="sm" mt="lg">
          <Stack justify="center" sx={{ height: 300, width: '100%' }}>
            <Text size="xl" color="dimmed" align="center" mb="md" weight={600}>
              Bạn chưa theo dõi truyện nào cả, bạn hãy tìm truyện trong{' '}
              <Anchor component={Link} href={Routes.MANGA}>
                danh sách{' '}
              </Anchor>
              nhé
            </Text>
            <Player
              autoplay
              loop
              src="/lottie-files/no-data.json"
              style={{
                height: '150px',
                aspectRatio: '1',
              }}
            />
          </Stack>
        </Paper>
      )}
    </WithSuspense>
  );
};

export default BookmarkPage;
