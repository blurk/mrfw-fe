import { Button, useMantineTheme } from '@mantine/core'
import { IconHeart, IconBookmark } from '@tabler/icons'
import React from 'react'
import { useSWRConfig } from 'swr'
import { useSession } from 'utils'

type Props = {
	mangaId: string
}

const MangaInfoCardFooterActions = ({ mangaId }: Props) => {
	const { user } = useSession()
	const { mutate } = useSWRConfig()

	const isBookmared = user?.profile?.bookmark?.includes(mangaId)
	const isLiked = false
	const theme = useMantineTheme()

	return (
		<>
			<Button
				variant='outline'
				color='red.7'
				leftIcon={
					<IconHeart
						size={18}
						fill={isLiked ? theme.colors.red[7] : 'transparent'}
					/>
				}>
				{isLiked ? 'Bỏ thích truyện' : 'Thích truyện'}
			</Button>
			<Button
				variant='outline'
				color='yellow.7'
				leftIcon={
					<IconBookmark
						size={18}
						fill={isBookmared ? theme.colors.yellow[7] : 'transparent'}
					/>
				}>
				{isBookmared ? 'Bỏ theo dõi' : 'Theo dõi truyện'}
			</Button>
		</>
	)
}

export default MangaInfoCardFooterActions
