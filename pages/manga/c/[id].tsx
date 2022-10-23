import { Alert, Box, Button, Group, Title } from '@mantine/core';
import { IconAlertCircle, IconArrowBack, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import ScrollToTop from 'components/atoms/ScrollToTop';
import ChapterSelection from 'components/molecules/ChapterSelection';
import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/future/image';
import Link from 'next/link';
import { getPlaiceholder, IGetPlaiceholderReturn } from 'plaiceholder';
import { ParsedUrlQuery } from 'querystring';
import { Fragment, useEffect } from 'react';
import { getAllChapters } from 'services/fetchers';
import client from 'services/initPocketBase';
import { Chapter, View } from 'types';
import { getImageUrl, serverDataTransform } from 'utils';

type Props = {
  chapterDetails: Chapter;
  chapterSelection: { value: string; label: string }[];
  prevChapter: string | null;
  nextChapter: string | null;
  view: View;
  images: (IGetPlaiceholderReturn | string)[];
};

const Chapter: NextPage<Props> = ({ chapterDetails, chapterSelection, prevChapter, nextChapter, view, images }) => {
  // Update views when user get in page
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        await client.records.update('views', view.id, {
          count: view.count + 1,
        });
      } catch (error) {}
    }, 7000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [chapterDetails.id, chapterDetails.expand, view.id, view.count]);

  const pageName = `${chapterDetails.expand?.belong_to.title ?? ''}: ${chapterDetails.name}`;

  return (
    <>
      <NextSeo title={pageName} description={chapterDetails.expand?.belong_to.description ?? ''} />

      <Link href={`/manga/${chapterDetails.belong_to}`}>
        <Button variant="subtle" leftIcon={<IconArrowBack />}>
          {'Xem Thông tin truyện'}
        </Button>
      </Link>

      <Title order={1} color="dark.7" mt="sm">
        {chapterDetails.name}
      </Title>

      {/* NAVIGATIONS */}
      <ScrollToTop />

      <Group position="apart" mt="sm">
        {prevChapter ? (
          <Link href={prevChapter}>
            <Button leftIcon={<IconChevronLeft size={18} />}>Chap trước</Button>
          </Link>
        ) : (
          <Button disabled>Chap trước</Button>
        )}

        <ChapterSelection defaultValue={chapterDetails.id} data={chapterSelection} key={chapterDetails.id} />

        {nextChapter ? (
          <Link href={nextChapter}>
            <Button rightIcon={<IconChevronRight size={18} />}>Chap Sau</Button>
          </Link>
        ) : (
          <Button disabled>Chap Sau</Button>
        )}
      </Group>

      {/* CHAPTER IMAGES */}

      <Box
        mt="md"
        sx={{
          textAlign: 'center',
        }}
      >
        {images.map((image, index) => {
          if (typeof image === 'string') {
            return (
              <Alert icon={<IconAlertCircle size={16} />} title="Ảnh bị lỗi" color="red" key={index}>
                Ảnh bị lỗi mất rồi :(
              </Alert>
            );
          }

          return (
            <Fragment key={index}>
              <Image
                placeholder="blur"
                alt={`trang ${index + 1}`}
                {...image.img}
                blurDataURL={image.base64}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <br />
            </Fragment>
          );
        })}
      </Box>

      {/* NAVIGATIONS */}
      <Group position="apart" mt="md">
        {prevChapter ? (
          <Link href={prevChapter}>
            <Button leftIcon={<IconChevronLeft size={18} />}>Chap trước</Button>
          </Link>
        ) : (
          <Button disabled>Chap trước</Button>
        )}

        <ChapterSelection defaultValue={chapterDetails.name} data={chapterSelection} />

        {nextChapter ? (
          <Link href={nextChapter}>
            <Button rightIcon={<IconChevronRight size={18} />}>Chap Sau</Button>
          </Link>
        ) : (
          <Button disabled>Chap Sau</Button>
        )}
      </Group>
    </>
  );
};

export default Chapter;

export async function getStaticPaths() {
  const chapterIds = await getAllChapters();

  if (chapterIds) {
    // Get the paths we want to pre-render based on posts
    const paths = chapterIds.map((id) => ({
      params: { id },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' };
  }
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const res = await client.records.getOne('chapter', params!.id as string, {
    expand: 'belong_to',
  });

  const mangaRes = await client.records.getOne('mangas', res.belong_to, {
    expand: 'chapters',
  });

  const viewRes = await client.records.getOne('views', mangaRes.view);

  const chapterList = mangaRes['@expand'].chapters as Chapter[];

  // Sort from old to new
  chapterList.sort((chapterA, chapterB) => {
    const dateA = new Date(chapterA.created);
    const dateB = new Date(chapterB.created);

    return dateA.getTime() - dateB.getTime();
  });

  const chapterSelection = chapterList.map((chap) => ({
    value: chap.id,
    label: chap.name,
  }));

  const currentChapterIndex = chapterList.findIndex((chap) => chap.id === params!.id);

  const prevChapter = chapterList[currentChapterIndex - 1];
  const nextChapter = chapterList[currentChapterIndex + 1];

  const chapterDetails = serverDataTransform(JSON.parse(JSON.stringify(res))) as unknown as Chapter;

  const imagePaths = chapterDetails.images.map((src) => getImageUrl('chapter', chapterDetails.id, src));

  const chunks: string[][] = [];
  for (let i = 0; i < imagePaths.length; i += 10) {
    chunks.push(imagePaths.slice(i, i + 10));
  }

  const images: (string | IGetPlaiceholderReturn)[] = [];

  for (let i = 0; i < chunks.length; i++) {
    // Delay by chunks index, this is so bad because of Pocketbase database lock :(
    const timeout = i * 1000;
    let count = 0;

    while (count < timeout) {
      count++;
    }

    const imageData = await Promise.allSettled(chunks[i].map(async (src) => getPlaiceholder(src))).then((results) =>
      results.map((r) => {
        if (r.status === 'fulfilled') {
          return r.value;
        } else {
          console.log(r.reason);
          return '';
        }
      })
    );

    images.push(...imageData);
  }

  return {
    props: {
      chapterDetails,
      chapterSelection,
      prevChapter: prevChapter ? `/manga/c/${prevChapter.id}` : null,
      nextChapter: nextChapter ? `/manga/c/${nextChapter.id}` : null,
      view: JSON.parse(JSON.stringify(viewRes)) as View,
      images,
    },
    revalidate: 60 * 60 * 24 * 7, // One week
  };
};
