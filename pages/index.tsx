import { Text } from '@mantine/core'
import type { NextPage } from 'next'
import { useTranslations } from 'next-intl'
import { NextSeo } from 'next-seo'
import { Author, Manga, Genre, Profile, Chapter } from 'types'

import { getServerSidePropsPageIndex } from '../services/getServerSideProps'

interface Props {
	data: Manga & {
		'@expand': {
			upload_by: Profile
			genres: Genre[]
			author: Author[]
			chapters: Chapter[]
			comments: Comment[]
		}
	}
}

const Home: NextPage<Props> = ({ data }) => {
	const t = useTranslations('Index')

	return (
		<>
			<NextSeo
				title={t('seo.title')}
				additionalLinkTags={[{ rel: 'icon', href: '/favicon.ico' }]}
				additionalMetaTags={[
					{ name: 'description', content: t('seo.description') }
				]}
			/>

			<Text size='xl' color='red'>
				{data['@expand'].upload_by.name}
			</Text>
		</>
	)
}

export default Home

export const getServerSideProps = getServerSidePropsPageIndex
