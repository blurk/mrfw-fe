import { BasePocketbaseRecord } from './base'

export interface Rating extends BasePocketbaseRecord {
	like: boolean
	by: string
	on_manga: string
}
