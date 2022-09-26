import { User } from 'pocketbase'
import { Author, Genre, MangaListRaw } from 'types'
import client from './initPocketBase'

export const uploadedMangaByUser = (): Promise<MangaListRaw> =>
	client.records
		.getList('mangas', 1, 10, {
			filter: `upload_by = "${(client.authStore.model as User).profile!.id}"`,
			expand: 'author, genres'
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
