import { Player } from '@lottiefiles/react-lottie-player'
import {
	Anchor,
	Button,
	Center,
	Group,
	Paper,
	Stack,
	Text,
	Title
} from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { IconArrowDown, IconArrowUp } from '@tabler/icons'
import Link from 'next/link'
import { useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Chapter } from 'types'
import { formatDate } from 'utils'

type Props = {
	data: Chapter[]
}

const ChapterViewer = ({ data }: Props) => {
	const [sortBy, toggleSortBy] = useToggle(['new', 'old'] as const)

	const rows = useMemo(() => {
		const sorted = data.sort((item1, item2) => {
			const date1 = new Date(item1.created)
			const date2 = new Date(item2.created)

			return sortBy === 'old'
				? date1.getTime() - date2.getTime()
				: date2.getTime() - date1.getTime()
		})

		return sorted.map((chap) => (
			<Link href={`/manga/c/${chap.id}`} key={chap.id}>
				<Group grow pr='lg' sx={{ height: '100%' }}>
					<Text color='blue'>{chap.name}</Text>
					<Text>{formatDate(chap.created)}</Text>
				</Group>
			</Link>
		))
	}, [data, sortBy])

	const Row = ({ index, style }: { index: number; style: any }) => (
		<div style={style}>
			<Paper
				radius={0}
				sx={(theme) => ({
					height: '100%',
					backgroundColor: index % 2 === 0 ? '' : theme.colors.gray[1],
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: theme.colors.blue[4],
						'& .mantine-Text-root': {
							color: 'white'
						}
					}
				})}>
				{rows[index]}
			</Paper>
		</div>
	)

	return (
		<Paper p='sm' mt='md' withBorder>
			<Group position='apart'>
				<Title order={3} mb='md'>
					Danh sách chương
				</Title>
				<Button
					onClick={() => toggleSortBy()}
					compact
					disabled={data.length === 0}>
					Sắp xếp theo chương {sortBy === 'old' ? 'mới nhất' : 'cũ nhất'}
				</Button>
			</Group>

			<Group grow pr='lg' mb='sm'>
				<Title order={4}>Tên chương</Title>
				<Center inline>
					<Title order={4}>Ngày đăng</Title>
					{sortBy === 'old' ? (
						<IconArrowUp size={18} />
					) : (
						<IconArrowDown size={18} />
					)}
				</Center>
			</Group>

			{data.length === 0 ? (
				<Stack justify='center' sx={{ height: 300 }}>
					<Title order={2} color='dimmed' align='center' mb='md' weight={600}>
						Truyện chưa có chương nào cả, bạn hãy quay lại sau nhé.
					</Title>
					<Player
						autoplay
						loop
						src='/lottie-files/no-data.json'
						style={{
							height: '150px',
							aspectRatio: '1'
						}}
					/>
					<Link href='/manga'>
						<Anchor align='center'>Đọc truyện khác</Anchor>
					</Link>
				</Stack>
			) : (
				<List height={300} itemCount={data.length} itemSize={35} width='100%'>
					{Row}
				</List>
			)}
		</Paper>
	)
}

export default ChapterViewer
