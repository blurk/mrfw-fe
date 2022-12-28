import { Player } from '@lottiefiles/react-lottie-player';
import { Anchor, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconEye } from '@tabler/icons';
import ClientOnly from 'components/atoms/ClientOnly';
import LikeButton from 'components/atoms/LikeButton';
import WithSuspense from 'components/atoms/WithSuspense';
import { User } from 'domains/user';
import Image from 'next/image';
import Link from 'next/link';
import { getLikedManga } from 'services/fetchers';
import useSWR from 'swr';
import { COLLECTION, getImageUrl, SWR_USER_KEY } from 'utils';
import { Routes } from 'utils/routes';

type Props = {
  user: User;
};

const LikedManga = ({ user }: Props) => {
  const { data } = useSWR(SWR_USER_KEY.LIKED, () => getLikedManga(user.id), {
    suspense: true,
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <Title order={1} mt="md" color="gray.8">
        Danh sách truyện đã thích
      </Title>

      {data.length > 0 ? (
        <SimpleGrid cols={3} spacing="xl" mt="md">
          {data.map((manga) => (
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
                <LikeButton mangaId={manga.id} />

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
              Bạn chưa thích truyện nào cả, bạn hãy tìm truyện trong{' '}
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

export default LikedManga;
