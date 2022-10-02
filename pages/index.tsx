import { Stack, Text } from '@mantine/core'
import MangaSection from 'components/atoms/MangaSection'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { HomePageContent } from 'seo'
import { Manga } from 'types'
import {
	MangaSectionColor,
	MangaSectionItemBadge,
	MangaSectionTitle
} from 'utils'

import { getServerSidePropsPageIndex } from '../services/getServerSideProps'

interface Props {
	recentlyUpdatedMangas: Manga[]
	newMangas: Manga[]
	hotMangas: Manga[]
}

const Home: NextPage<Props> = ({
	newMangas,
	recentlyUpdatedMangas,
	hotMangas
}) => {
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
					sectionTitle={MangaSectionTitle.RECENTLY_UPDATED}
					itemBadgeText={MangaSectionItemBadge.RECENTLY_UPDATED}
					accentColor={MangaSectionColor.RECENTLY_UPDATED}
					data={recentlyUpdatedMangas}
				/>

				<MangaSection
					sectionTitle={MangaSectionTitle.NEW}
					itemBadgeText={MangaSectionItemBadge.NEW}
					accentColor={MangaSectionColor.NEW}
					data={newMangas}
				/>

				<MangaSection
					sectionTitle={MangaSectionTitle.HOT}
					itemBadgeText={MangaSectionItemBadge.HOT}
					accentColor={MangaSectionColor.HOT}
					data={hotMangas}
				/>
			</Stack>
		</>
	)
}

export default Home

export const getServerSideProps = getServerSidePropsPageIndex
