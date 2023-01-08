import { Player } from '@lottiefiles/react-lottie-player';
import { Title, SimpleGrid, Card, Group, Button, Paper, Stack, Anchor, Text } from '@mantine/core';
import { IconEye } from '@tabler/icons';
import BookmarkButton from 'components/atoms/BookmarkButton';
import { Manga, User } from 'domains';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getBookmark } from 'services/fetchers';
import useSWR from 'swr';
import { getImageUrl, COLLECTION, SWR_USER_KEY } from 'utils';
import { Routes } from 'utils/routes';

type Props = { user: User };

const BookmarkManga = ({ user }: Props) => {
  const { data } = useSWR(SWR_USER_KEY.BOOKMARK, () => getBookmark(user.id), {
    suspense: true,
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <Title order={1} mt="md" color="gray.8">
        Danh sách truyện theo dõi
      </Title>

      {data.length > 0 ? (
        <SimpleGrid cols={3} spacing="xl" mt="md">
          {data.map((manga: Manga) => (
            <Card shadow="sm" p="lg" radius="md" withBorder key={manga.id}>
              <Card.Section>
                <Image
                  src={getImageUrl(COLLECTION.MANGAS, manga.id, manga.cover, '300x100')}
                  width={300}
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
                <BookmarkButton mangaId={manga.id} uploadBy={manga.upload_by} />

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
    </>
  );
};

export default BookmarkManga;
