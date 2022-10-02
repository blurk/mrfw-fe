import { BasePocketbaseRecordRaw } from './base'

export interface Profile extends BasePocketbaseRecordRaw {
	userId: string
	name: string
	avatar: null | string
	bookmark: string[]
}
