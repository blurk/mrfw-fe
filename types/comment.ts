import { BasePocketbaseRecord } from './base'

export interface Comment extends BasePocketbaseRecord {
	content: string
	by: string
}
