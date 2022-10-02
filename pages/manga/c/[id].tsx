import { Box, Button, Group, Title } from '@mantine/core'
import { IconArrowBack, IconChevronLeft, IconChevronRight } from '@tabler/icons'
import ScrollToTop from 'components/atoms/ScrollToTop'
import ChapterSelection from 'components/molecules/ChapterSelection'
import { GetServerSidePropsContext, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import client from 'services/initPocketBase'
import { Chapter, View } from 'types'
import { getImageUrl, serverDataTransform } from 'utils'

type Props = {
	chapterDetails: Chapter
	chapterSelection: { value: string; label: string }[]
	prevChapter: string | null
	nextChapter: string | null
	view: View
}

const Chapter: NextPage<Props> = ({
	chapterDetails,
	chapterSelection,
	prevChapter,
	nextChapter,
	view
}) => {
	// Update views when user get in page
	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			try {
				await client.records.update('views', view.id, {
					count: view.count + 1
				})
			} catch (error) {}
		}, 7000)

		return () => {
			clearTimeout(timeoutId)
		}
	}, [chapterDetails.id, chapterDetails.expand, view.id, view.count])

	const pageName = `${chapterDetails.expand?.belong_to.title ?? ''}: ${
		chapterDetails.name
	}`

	return (
		<>
			<NextSeo
				title={pageName}
				description={chapterDetails.expand?.belong_to.description ?? ''}
			/>

			<Link href={`/manga/${chapterDetails.belong_to}`}>
				<Button variant='subtle' leftIcon={<IconArrowBack />}>
					{chapterDetails.expand?.belong_to.title ?? 'Xem Thông tin truyện'}
				</Button>
			</Link>

			<Title order={1} color='dark.7' mt='sm'>
				{chapterDetails.name}
			</Title>

			{/* NAVIGATIONS */}
			<ScrollToTop />

			<Group position='apart' mt='sm'>
				{prevChapter ? (
					<Link href={prevChapter}>
						<Button leftIcon={<IconChevronLeft size={18} />}>Chap trước</Button>
					</Link>
				) : (
					<Button disabled>Chap trước</Button>
				)}

				<ChapterSelection
					defaultValue={chapterDetails.name}
					data={chapterSelection}
				/>

				{nextChapter ? (
					<Link href={nextChapter}>
						<Button rightIcon={<IconChevronRight size={18} />}>Chap Sau</Button>
					</Link>
				) : (
					<Button disabled>Chap Sau</Button>
				)}
			</Group>

			{/* CHAPTER IMAGES */}

			<Box mt='md'>
				{chapterDetails.images.map((image) => (
					<Box
						key={image}
						sx={{
							aspectRatio: '2/3',
							position: 'relative',
							marginInline: 'auto'
						}}>
						<Image
							alt='trang'
							src={getImageUrl('chapter', chapterDetails.id, image)}
							layout='fill'
							objectFit='contain'
							objectPosition='center'
							placeholder='blur'
							blurDataURL='/placeholder.png'
						/>
					</Box>
				))}
			</Box>

			{/* NAVIGATIONS */}
			<Group position='apart' mt='md'>
				{prevChapter ? (
					<Link href={prevChapter}>
						<Button leftIcon={<IconChevronLeft size={18} />}>Chap trước</Button>
					</Link>
				) : (
					<Button disabled>Chap trước</Button>
				)}

				<ChapterSelection
					defaultValue={chapterDetails.name}
					data={chapterSelection}
				/>

				{nextChapter ? (
					<Link href={nextChapter}>
						<Button rightIcon={<IconChevronRight size={18} />}>Chap Sau</Button>
					</Link>
				) : (
					<Button disabled>Chap Sau</Button>
				)}
			</Group>
		</>
	)
}

export default Chapter

export const getServerSideProps = async ({
	query
}: GetServerSidePropsContext) => {
	const res = await client.records.getOne('chapter', query.id as string, {
		expand: 'belong_to'
	})

	const mangaRes = await client.records.getOne('mangas', res.belong_to, {
		expand: 'chapters'
	})

	const viewRes = await client.records.getOne('views', mangaRes.view)

	const chapterList = mangaRes['@expand'].chapters as Chapter[]

	// Sort from old to new
	chapterList.sort((chapterA, chapterB) => {
		const dateA = new Date(chapterA.created)
		const dateB = new Date(chapterB.created)

		return dateA.getTime() - dateB.getTime()
	})

	const chapterSelection = chapterList.map((chap) => ({
		value: chap.id,
		label: chap.name
	}))

	const currentChapterIndex = chapterList.findIndex(
		(chap) => chap.id === query.id
	)

	const prevChapter = chapterList[currentChapterIndex - 1]
	const nextChapter = chapterList[currentChapterIndex + 1]

	const chapterDetails = serverDataTransform(JSON.parse(JSON.stringify(res)))

	return {
		props: {
			chapterDetails,
			chapterSelection,
			prevChapter: prevChapter ? `/manga/c/${prevChapter.id}` : null,
			nextChapter: nextChapter ? `/manga/c/${nextChapter.id}` : null,
			view: JSON.parse(JSON.stringify(viewRes))
		}
	}
}
