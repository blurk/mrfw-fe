import { User } from "pocketbase";
import { Author, ChapterList, Genre, MangaListRaw, MangaRaw } from "types";
import client from "./initPocketBase";

export const uploadedMangaByUser = (): Promise<MangaListRaw> =>
  client.records
    .getList("mangas", 1, 10, {
      filter: `upload_by = "${(client.authStore.model as User).profile!.id}"`,
      expand: "author, genres",
    })
    .then((data) => JSON.parse(JSON.stringify(data)));

export const getGenres = (): Promise<{ value: string; label: string }[]> =>
  client.records.getFullList("genres", Number.MAX_SAFE_INTEGER).then((data) =>
    JSON.parse(JSON.stringify(data)).map((item: Genre) => ({
      value: item.id,
      label: item.name,
    }))
  );

export const getAuthors = (): Promise<{ value: string; label: string }[]> =>
  client.records.getFullList("authors", Number.MAX_SAFE_INTEGER).then((data) =>
    JSON.parse(JSON.stringify(data)).map((item: Author) => ({
      value: item.id,
      label: item.name,
    }))
  );

export const getChaptersOfManga = async (id: string) => {
  try {
    const resData = await client.records.getOne("mangas", id);
    const data: MangaRaw = JSON.parse(JSON.stringify(resData));

    const filterString = data.chapters.map((c) => `id = '${c}'`).join(" || ");

    try {
      const chapters = await client.records.getList("chapter", 1, 10, {
        filter: `${filterString}`,
      });

      return JSON.parse(JSON.stringify(chapters)) as ChapterList;
    } catch (error) {
      console.log(error);
    }
  } catch (e) {
    console.log(e);
  }
};
