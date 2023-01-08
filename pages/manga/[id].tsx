import ChapterViewer from 'components/atoms/ChapterViewer';
import { MangaInfoCard } from 'components/atoms/MangaInfoCard';
import CommentSection from 'components/molecules/CommentSection';
import { Comment as CommentDomain, Manga } from 'domains';
import { GetServerSidePropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import client from 'services/initPocketBase';
import { SWRConfig } from 'swr';
import { COLLECTION, getAuthorsName, getGenresName, getImageUrl } from 'utils';

type Props = {
  mangaDetails: Manga;
  fallback: {
    [key: string]: CommentDomain[];
  };
};

const PageMangaSingle: NextPage<Props> = ({ mangaDetails, fallback }) => {
  let latestChapter = undefined;
  let firstChapter = undefined;

  if (mangaDetails.expand?.chapters) {
    // Sort from old to new
    mangaDetails.expand.chapters.sort((chapterA, chapterB) => {
      const dateA = new Date(chapterA.created);
      const dateB = new Date(chapterB.created);

      return dateA.getTime() - dateB.getTime();
    });

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
        uploadById={mangaDetails.upload_by}
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

      <SWRConfig value={{ fallback }}>
        <CommentSection currentMangaId={mangaDetails.id} />
      </SWRConfig>
    </>
  );
};

export default PageMangaSingle;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const res = await client.collection(COLLECTION.MANGAS).getOne(query.id as string, {
    expand: 'upload_by,genres,author,chapters,comments,comments.by,view',
  });

  const mangaDetails = JSON.parse(JSON.stringify(res)) as Manga;

  return {
    props: {
      mangaDetails,
      fallback: {
        [`${mangaDetails.id}-comments`]: mangaDetails.expand.comments ?? [],
      },
    },
  };
};
