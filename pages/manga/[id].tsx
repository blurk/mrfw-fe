import ChapterViewer from 'components/atoms/ChapterViewer';
import { MangaInfoCard } from 'components/atoms/MangaInfoCard';
import { GetServerSidePropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import client from 'services/initPocketBase';
import { Manga } from 'types';
import { getAuthorsName, getGenresName, getImageUrl, serverDataTransform } from 'utils';

type Props = {
  mangaDetails: Manga;
};

const PageMangaSingle: NextPage<Props> = ({ mangaDetails }) => {
  let latestChapter = undefined;
  let firstChapter = undefined;

  if (mangaDetails.expand?.chapters) {
    latestChapter = mangaDetails.expand?.chapters.at(-1)?.id ?? undefined;
    firstChapter = mangaDetails.expand?.chapters.at(0)?.id ?? undefined;
  }

  return (
    <>
      <NextSeo title={mangaDetails.title} description={mangaDetails.description} />

      <MangaInfoCard
        id={mangaDetails.id}
        title={mangaDetails.title}
        status={mangaDetails.status}
        description={mangaDetails.description}
        uploadBy={mangaDetails.expand?.upload_by ? mangaDetails.expand.upload_by.name : ''}
        created={mangaDetails.created}
        updated={mangaDetails.updated}
        views={mangaDetails.expand?.view.count ?? 0}
        genres={getGenresName(mangaDetails.expand?.genres ?? [])}
        authors={getAuthorsName(mangaDetails.expand?.author ?? [])}
        cover={getImageUrl('mangas', mangaDetails.id, mangaDetails.cover, '300x0f')}
        backgroundCover={getImageUrl('mangas', mangaDetails.id, mangaDetails.cover, '600x0')}
        latestChapter={latestChapter}
        firstChapter={firstChapter}
      />

      <ChapterViewer data={mangaDetails.expand?.chapters ?? []} />
    </>
  );
};

export default PageMangaSingle;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const res = await client.records.getOne('mangas', query.id as string, {
    expand: 'upload_by,genres,author,chapters,comments,view',
  });

  const mangaDetails = serverDataTransform(JSON.parse(JSON.stringify(res)));

  return {
    props: {
      mangaDetails,
    },
  };
};
