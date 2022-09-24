import { BasePocketbaseRecord } from './base'

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
}
