import { Title } from '@mantine/core'
import { NextPage } from 'next'
import Head from 'next/head'

type Props = {}

const PageMangaIndex: NextPage<Props> = (props) => {
	return (
		<>
			<Head>
				<title>Danh sách truyện</title>
			</Head>

			<Title>Danh sách truyện</Title>
		</>
	)
}

export default PageMangaIndex
