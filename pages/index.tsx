import { Stack, Text } from '@mantine/core'
import MangaSection from 'components/atoms/MangaSection'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { HomePageContent } from 'seo'
import { Manga } from 'types'

import { getServerSidePropsPageIndex } from '../services/getServerSideProps'

interface Props {
	data: Manga[]
}

const Home: NextPage<Props> = ({ data }) => {
	return (
		<>
			<NextSeo
				title={HomePageContent.seo.title}
				additionalMetaTags={[
					{ name: 'description', content: HomePageContent.seo.description }
				]}
			/>

			<Stack>
				<MangaSection sectionTitle='Truyện mới cập nhật' data={data} />
			</Stack>
		</>
	)
}

export default Home

export const getServerSideProps = getServerSidePropsPageIndex
