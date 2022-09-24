import { BasePocketbaseRecord } from './base'

export interface Profile extends BasePocketbaseRecord {
	name: string
	avatar: string
}
