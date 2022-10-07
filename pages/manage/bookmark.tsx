import { Box, List, Loader, Paper, ScrollArea, Title } from '@mantine/core';
import { IconBook } from '@tabler/icons';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';
import { getBookmark } from 'services/fetchers';
import client from 'services/initPocketBase';
import useSWR, { useSWRConfig } from 'swr';
import { Manga } from 'types';
import { useSession } from 'utils';

type Props = {};

const BookmarkPage: NextPage<Props> = (props) => {
  const { user, isLoading } = useSession();

  const { mutate } = useSWRConfig();

  const { data, error, isValidating } = useSWR('bookmark', () => getBookmark(user!.profile!.id), {
    isPaused: () => client.authStore.model == null,
  });

  console.log({ data, error, isValidating });

  useEffect(() => {
    if (!isLoading && !user) {
      Router.push('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <Loader />
      </Box>
    );
  }

  if (!user || !user.profile) {
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
        {(!data && !error) || isValidating ? (
          <Loader />
        ) : (
          <ScrollArea
            sx={{
              height: 500,
            }}
          >
            <List>
              {data &&
                data.map((manga) => (
                  <List.Item key={manga.id} icon={<IconBook size={18} />}>
                    {manga.title}
                  </List.Item>
                ))}
            </List>
          </ScrollArea>
        )}
      </Paper>
    </>
  );
};

export default BookmarkPage;
