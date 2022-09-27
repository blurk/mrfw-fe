import { BasePocketbaseCollection, BasePocketbaseRecord } from './base'
import { Author } from './author'
import { Chapter } from './chapter'
import { Genre } from './genre'
import { Profile } from './profile'

export interface MangaExpand {
	upload_by: Profile
	genres: Genre[]
	author: Author[]
	chapters: Chapter[]
	comments: Comment[]
}

export interface Manga extends BasePocketbaseRecord {
	title: string
	description: string
	genres: string[]
	status: string
	cover: string
	author: string[]
	chapters: string[]
	comments: string[]
	upload_by: string
	expand?: MangaExpand
}

export interface MangaRaw extends Omit<Manga, 'expand'> {
	'@expand'?: MangaExpand
}

export interface MangaList extends BasePocketbaseCollection<Manga> {}

export interface MangaListRaw extends BasePocketbaseCollection<MangaRaw> {}

export interface MangaUploadRequest
	extends Pick<
		Manga,
		'title' | 'description' | 'author' | 'status' | 'genres' | 'upload_by'
	> {
	cover: File | null | string
}

export interface SWRMangaUploadFormStatus {
	isDirty: boolean
	editData: MangaRaw | null
}
