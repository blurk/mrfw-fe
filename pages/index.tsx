import { Stack, Text } from '@mantine/core'
import MangaSection from 'components/atoms/MangaSection'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { HomePageContent } from 'seo'
import { Manga } from 'types'

import { getServerSidePropsPageIndex } from '../services/getServerSideProps'

interface Props {
	recentlyUpdatedMangas: Manga[]
	newMangas: Manga[]
}

const Home: NextPage<Props> = ({ newMangas, recentlyUpdatedMangas }) => {
	return (
		<>
			<NextSeo
				title={HomePageContent.seo.title}
				additionalMetaTags={[
					{ name: 'description', content: HomePageContent.seo.description }
				]}
			/>

			<Stack>
				<MangaSection
					sectionTitle='Truyện mới cập nhật'
					data={recentlyUpdatedMangas}
				/>

				<MangaSection sectionTitle='Truyện mới' data={newMangas} />
			</Stack>
		</>
	)
}

export default Home

export const getServerSideProps = getServerSidePropsPageIndex
