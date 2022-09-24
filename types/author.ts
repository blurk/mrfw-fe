import { BasePocketbaseRecord } from './base'

export interface Author extends BasePocketbaseRecord {
	name: string
	mangas: string[]
}
