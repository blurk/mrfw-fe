import { GetServerSidePropsContext } from 'next'
import { serverDataTransform } from 'utils/dataTransform'
import client from '../initPocketBase'

export async function getServerSidePropsPageIndex({}: GetServerSidePropsContext) {
	const data = await client.records.getFullList(
		'mangas',
		Number.MAX_SAFE_INTEGER,
		{
			expand: 'upload_by',
			sort: '-created'
		}
	)

	const items = data.map(serverDataTransform)

	return {
		props: {
			data: items
		}
	}
}
