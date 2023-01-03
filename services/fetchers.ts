import { Author, Chapter, ChapterList, Genre, Manga } from 'domains';
import { Notification } from 'domains/notifications';
import { ListResult } from 'pocketbase';
import { COLLECTION, parseServerData } from 'utils';
import client from './initPocketBase';

export const uploadedMangaByUser = (page = 1, pageSize = 10): Promise<ListResult<Manga>> =>
  client
    .collection(COLLECTION.MANGAS)
    .getList(page, pageSize, {
      filter: `upload_by = "${client.authStore.model!.id}"`,
      expand: 'author, genres',
      sort: '-created',
    })
    .then((data) => JSON.parse(JSON.stringify(data)));

export const getGenres = (): Promise<{ value: string; label: string }[]> =>
  client
    .collection(COLLECTION.GENERS)
    .getFullList(Number.MAX_SAFE_INTEGER)
    .then((data) =>
      JSON.parse(JSON.stringify(data)).map((item: Genre) => ({
        value: item.id,
        label: item.name,
      }))
    );

export const getAuthors = (): Promise<{ value: string; label: string }[]> =>
  client
    .collection(COLLECTION.AUTHORS)
    .getFullList(Number.MAX_SAFE_INTEGER)
    .then((data) =>
      JSON.parse(JSON.stringify(data)).map((item: Author) => ({
        value: item.id,
        label: item.name,
      }))
    );

export const getChaptersOfManga = async (mangaId: string, page = 1, perPage = 10) => {
  try {
    try {
      const chapters = await client.collection(COLLECTION.CHAPTER).getList(page, perPage, {
        filter: `belong_to = "${mangaId}"`,
        sort: '-created',
      });

      return parseServerData(chapters) as ChapterList;
    } catch (error) {
      console.log(error);
    }
  } catch (e) {
    console.log(e);
  }
};

export const searchManga = async (searchText: string) => {
  try {
    const res = await client.collection(COLLECTION.MANGAS).getFullList(Number.MAX_SAFE_INTEGER, {
      expand: 'author',
      filter: `title~"${searchText}"`,
    });

    const resData = JSON.parse(JSON.stringify(res));

    return resData.map((manga: Manga) => ({
      value: manga.id,
      ...manga,
    })) as Manga[];
  } catch (err) {
    console.log(err);
  }
};

export const getBookmark = async (profileId: string) => {
  try {
    const res = await client.collection(COLLECTION.USERS).getOne(profileId, {
      expand: 'bookmark',
    });

    const json = JSON.parse(JSON.stringify(res));

    const bookmark = json.bookmark.length === 0 ? [] : json.expand.bookmark;

    return bookmark as Manga[];
  } catch (error) {
    console.log(error);
  }
};

export const getLikedManga = async (profileId: string) => {
  try {
    const res = await client.collection('users').getOne(profileId, {
      expand: 'liked',
    });

    const json = JSON.parse(JSON.stringify(res));

    const liked = json.liked.length === 0 ? [] : json.expand.liked;

    return liked as Manga[];
  } catch (error) {
    console.log(error);
  }
};

export const getAllChapters = async () => {
  try {
    const res = await client.collection(COLLECTION.CHAPTER).getFullList();
    const json = parseServerData(res) as Chapter[];

    return json.map((chapter) => chapter.id) as string[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch, received message ${error.message}`);
    }
  }
};

export const getCurrentUserNotifications = async (userId: string) => {
  try {
    const res = await client.collection(COLLECTION.NOTIFICATIONS).getFullList(undefined, {
      filter: `of_user="${userId}"`,
      expand: 'of_chapter',
    });
    const json = parseServerData(res) as Notification[];

    return json;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch, received message ${error.message}`);
    }
  }
};
