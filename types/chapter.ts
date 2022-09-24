import { BasePocketbaseRecord } from './base'

export interface Chapter extends BasePocketbaseRecord {
	name: string
	images: string[]
}
