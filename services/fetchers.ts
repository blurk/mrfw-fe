import { User } from 'pocketbase'
import { Author, ChapterList, Genre, Manga, MangaListRaw } from 'types'
import { serverDataTransform } from 'utils'
import client from './initPocketBase'

export const uploadedMangaByUser = (
	page = 1,
	pageSize = 10
): Promise<MangaListRaw> =>
	client.records
		.getList('mangas', page, pageSize, {
			filter: `upload_by = "${(client.authStore.model as User).profile!.id}"`,
			expand: 'author, genres',
			sort: '-created'
		})
		.then((data) => JSON.parse(JSON.stringify(data)))

export const getGenres = (): Promise<{ value: string; label: string }[]> =>
	client.records.getFullList('genres', Number.MAX_SAFE_INTEGER).then((data) =>
		JSON.parse(JSON.stringify(data)).map((item: Genre) => ({
			value: item.id,
			label: item.name
		}))
	)

export const getAuthors = (): Promise<{ value: string; label: string }[]> =>
	client.records.getFullList('authors', Number.MAX_SAFE_INTEGER).then((data) =>
		JSON.parse(JSON.stringify(data)).map((item: Author) => ({
			value: item.id,
			label: item.name
		}))
	)

export const getChaptersOfManga = async (
	mangaId: string,
	page = 1,
	perPage = 10
) => {
	try {
		try {
			const chapters = await client.records.getList('chapter', page, perPage, {
				filter: `belong_to = "${mangaId}"`,
				sort: '-created'
			})

			return JSON.parse(JSON.stringify(chapters)) as ChapterList
		} catch (error) {
			console.log(error)
		}
	} catch (e) {
		console.log(e)
	}
}

export const searchManga = async (searchText: string) => {
	try {
		const res = await client.records.getFullList(
			'mangas',
			Number.MAX_SAFE_INTEGER,
			{
				expand: 'author',
				filter: `title~"${searchText}"`
			}
		)

		const resData = JSON.parse(JSON.stringify(res))

		return resData.map(serverDataTransform).map((manga: Manga) => ({
			value: manga.id,
			...manga
		})) as Manga[]
	} catch (err) {
		console.log(err)
	}
}
