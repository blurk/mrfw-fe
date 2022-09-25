import { Record } from 'pocketbase'

export const serverDataTransform = (item: Record) => ({
	...item,
	collectionId: item['@collectionId'],
	collectionName: item['@collectionName'],
	expand: item['@expand'] ?? undefined
})
