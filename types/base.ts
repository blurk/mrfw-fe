export interface BasePocketbaseRecordRaw {
	'@collectionId': string
	'@collectionName': string
	id: string
	created: string
	updated: string
}

export interface BasePocketbaseRecord
	extends Omit<BasePocketbaseRecordRaw, '@collectionId' | '@collectionName'> {
	collectionId: string
	collectionName: string
}

export interface BasePocketbaseCollection<T extends object> {
	page: number
	perPage: number
	totalItems: number
	items: T[]
}
