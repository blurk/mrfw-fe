import { GetServerSidePropsContext } from 'next'
import client from '../ApiClient'

export async function getServerSidePropsPageIndex({
	locale
}: GetServerSidePropsContext) {
	const data = await client.records.getOne('mangas', 'iaxsr8kct3f26ww', {
		expand: 'upload_by'
	})

	return {
		props: {
			data: { ...data },
			messages: (await import(`../../locales/${locale}.json`)).default
		}
	}
}
