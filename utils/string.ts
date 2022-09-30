export const getImageUrl = (
	collectionId: string,
	recordId: string,
	url: string
) => `${process.env.NEXT_PUBLIC_FILES_URL}/${collectionId}/${recordId}/${url}`

export const getKey = (pageIndex: number, perPage: number) => [
	'chapters-table',
	pageIndex,
	perPage
]
