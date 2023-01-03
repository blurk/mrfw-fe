import { Manga } from 'domains/manga';
import { GetServerSidePropsContext } from 'next';
import { COLLECTION, getThisWeekStartTime, getTodayStartTime } from 'utils';
import { parseServerData } from 'utils/dataTransform';
import client from '../initPocketBase';

export async function getServerSidePropsPageIndex({}: GetServerSidePropsContext) {
  const recentlyUpdatedMangas = await client.collection(COLLECTION.MANGAS).getFullList(Number.MAX_SAFE_INTEGER, {
    expand: 'upload_by,view',
    sort: '-updated',
    filter: `updated>='${getTodayStartTime()}'`,
  });

  const newMangas = await client.collection(COLLECTION.MANGAS).getFullList(Number.MAX_SAFE_INTEGER, {
    expand: 'upload_by,view',
    sort: '-created',
    filter: `created>='${getThisWeekStartTime()}'`,
  });

  // Get all manga then sort by most view 10 mangas

  const allMangas = await client.collection(COLLECTION.MANGAS).getFullList<Manga>(Number.MAX_SAFE_INTEGER, {
    expand: 'upload_by,view',
  });

  const hotMangas = allMangas
    .sort((mangaA, mangaB) => mangaB.expand.view.count - mangaA.expand.view.count)
    .slice(0, 10);

  const props = {
    recentlyUpdatedMangas: parseServerData(recentlyUpdatedMangas),
    newMangas: parseServerData(newMangas),
    hotMangas: parseServerData(hotMangas),
  };

  return {
    props,
  };
}
