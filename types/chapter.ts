import { BasePocketbaseCollection, BasePocketbaseRecord } from './base'
import { Manga } from './manga'

interface ChapterExpand {
	belong_to: Manga
}

export interface Chapter extends BasePocketbaseRecord {
	name: string
	images: string[]
	belong_to: string
	expand?: ChapterExpand
}

export interface Chapter extends BasePocketbaseRecord {
	name: string
	images: string[]
	belong_to: string
}

export interface ChapterList extends BasePocketbaseCollection<Chapter> {}

export interface ChapterRequest extends Pick<Chapter, 'name'> {
	images: File[] | string[]
}
