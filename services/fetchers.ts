import { User } from 'pocketbase'
import { MangaListRaw } from 'types'
import client from './initPocketBase'

export const uploadedMangaByUser = (): Promise<MangaListRaw> =>
	client.records
		.getList('mangas', 1, 10, {
			filter: `upload_by = "${(client.authStore.model as User).profile!.id}"`,
			expand: 'author, genres'
		})
		.then((data) => JSON.parse(JSON.stringify(data)))
