import { Anchor, Box, Title, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { Manga } from 'types'
import { Carousel } from '@mantine/carousel'
import { MangaCard } from './MangaCard'
import { useMediaQuery } from '@mantine/hooks'

type Props = {
	sectionTitle: string
	data: Manga[]
}

const MangaSection = ({ sectionTitle, data }: Props) => {
	const theme = useMantineTheme()

	const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
	const slides = data.map((item) => (
		<Carousel.Slide key={item.id}>
			<MangaCard {...item} />
		</Carousel.Slide>
	))

	return (
		<Box>
			<Link href='/manga' passHref>
				<Anchor underline={false}>
					<Title order={2} color='red'>
						{sectionTitle}
					</Title>
				</Anchor>
			</Link>
			<Carousel
				height={400}
				slideSize='30%'
				slideGap='xl'
				align='start'
				mt='md'
				slidesToScroll={mobile ? 1 : 3}
				breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
				styles={{
					control: {
						'&[data-inactive]': {
							opacity: 0,
							cursor: 'default'
						}
					}
				}}>
				{slides}
			</Carousel>
		</Box>
	)
}

export default MangaSection
