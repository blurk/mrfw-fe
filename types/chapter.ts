import { BasePocketbaseCollection, BasePocketbaseRecord } from './base'

export interface Chapter extends BasePocketbaseRecord {
	name: string
	images: string[]
	belong_to: string
}

export interface ChapterList extends BasePocketbaseCollection<Chapter> {}

export interface ChapterRequest extends Pick<Chapter, 'name'> {
	images: File[] | string[]
}
