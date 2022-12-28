import { Player } from '@lottiefiles/react-lottie-player';
import { Group, Pagination, Paper, SimpleGrid, Stack, Title } from '@mantine/core';
import { MangaCard } from 'components/atoms/MangaCard';
import MangaPageHeader from 'components/atoms/MangaPageHeader';
import ScrollToTop from 'components/atoms/ScrollToTop';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRef } from 'react';
import client from 'services/initPocketBase';
import { Genre, MangaList } from 'domains';
import { COLLECTION } from 'utils';

type Props = {
  mangas: MangaList | null;
  genres: { value: string; label: string }[];
};

const PageMangaIndex: NextPage<Props> = ({ mangas, genres }) => {
  const currentPageRef = useRef<number>(1);

  const handlePageChange = (page: number) => {
    currentPageRef.current = page;
  };

  return (
    <>
      <Head>
        <title>Danh sách truyện</title>
      </Head>

      <Title>Danh sách truyện</Title>

      <form>
        {/* <input type='hidden' name='page' value={currentPageRef.current} /> */}
        <MangaPageHeader genresData={genres} />
      </form>
      <ScrollToTop />

      {!mangas || mangas.totalItems === 0 ? (
        <Paper p="sm" mt="lg">
          <Stack justify="center" sx={{ height: 300 }}>
            <Title order={2} color="dimmed" align="center" mb="md" weight={600}>
              Không tìm thấy, bạn hãy thử tìm kiếm khác nhé
            </Title>
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
      ) : (
        <div>
          <SimpleGrid cols={3} mt="xl">
            {mangas.items.map((manga) => (
              <MangaCard key={manga.id} {...manga} />
            ))}
          </SimpleGrid>
          <Group position="center" mt="md">
            <Pagination total={Math.ceil(mangas.totalItems / mangas.perPage)} onChange={handlePageChange} />
          </Group>
        </div>
      )}
    </>
  );
};

export default PageMangaIndex;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const { sortBy = 'title', searchText = '', genreId = '' } = query;

  const genreFilter = (genreId as string)
    .split(',')
    .map((g) => `genres~'${g}'`)
    .join(' && ');

  const sort = sortBy;
  const filter = `(title~'${searchText}' && ${genreFilter})`;

  let mangaRes = null;
  let genresRes = null;

  try {
    mangaRes = await client.collection(COLLECTION.MANGAS).getList(1, 30, {
      expand: 'upload_by,view',
      sort,
      filter,
    });

    genresRes = await client.collection(COLLECTION.GENERS).getFullList();
  } catch (error) {
    return {
      props: {
        mangas: null,
        geners: [],
      },
    };
  }

  const mangas = JSON.parse(JSON.stringify(mangaRes));
  const genres = JSON.parse(JSON.stringify(genresRes)).map((item: Genre) => ({
    value: item.id,
    label: item.name,
  }));

  return {
    props: {
      mangas: {
        ...mangas,
        items: mangas.items,
      },
      genres,
    },
  };
};
