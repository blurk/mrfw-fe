import { GetServerSidePropsContext } from 'next'
import { getThisWeekStartTime, getTodayStartTime } from 'utils'
import { serverDataTransform } from 'utils/dataTransform'
import client from '../initPocketBase'

export async function getServerSidePropsPageIndex({}: GetServerSidePropsContext) {
	const recentlyUpdatedMangas = await client.records.getFullList(
		'mangas',
		Number.MAX_SAFE_INTEGER,
		{
			expand: 'upload_by',
			sort: '-updated',
			filter: `updated>='${getTodayStartTime()}'`
		}
	)

	const newMangas = await client.records.getFullList(
		'mangas',
		Number.MAX_SAFE_INTEGER,
		{
			expand: 'upload_by',
			sort: '-created',
			filter: `created>='${getThisWeekStartTime()}'`
		}
	)

	const props = {
		recentlyUpdatedMangas: recentlyUpdatedMangas.map(serverDataTransform),
		newMangas: newMangas.map(serverDataTransform)
	}

	return {
		props
	}
}
