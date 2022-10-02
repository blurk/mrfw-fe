import {
	Badge,
	Box,
	Button,
	Card,
	createStyles,
	Group,
	Overlay,
	Paper,
	Spoiler,
	Text
} from '@mantine/core'
import { IconBookmark, IconHeart } from '@tabler/icons'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, MangaStatusText, relativeTimeFromNow } from 'utils'
import MangaStatusBadge from './MangaStatusBadge'
import SubInfo from './SubInfo'

const useStyles = createStyles((theme) => ({
	card: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		position: 'relative'
	},

	section: {
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
		paddingBottom: theme.spacing.md
	},

	label: {
		textTransform: 'uppercase',
		fontSize: theme.fontSizes.xs,
		fontWeight: 700
	}
}))

interface Props {
	cover: string
	title: string
	status: string
	description: string
	genres: string[]
	authors: string
	uploadBy: string
	created: string
	updated: string
	views: number
	latestChapter?: string
	firstChapter?: string
}

export function MangaInfoCard({
	cover,
	title,
	description,
	status,
	genres,
	authors,
	uploadBy,
	created,
	updated,
	views,
	firstChapter,
	latestChapter
}: Props) {
	const { classes } = useStyles()

	const genresDisplay = genres.map((genres) => (
		<Badge color='cyan' key={genres}>
			{genres}
		</Badge>
	))

	return (
		<Card withBorder p='md' pt={0} className={classes.card}>
			{/* COVER */}
			<Paper
				sx={{
					position: 'absolute',
					width: '150px',
					aspectRatio: '2/3',
					zIndex: 2,
					left: '5%',
					top: '10%',
					boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
				}}>
				<Image
					src={cover}
					alt='cover'
					layout='fill'
					objectFit='cover'
					objectPosition='center'
				/>
			</Paper>

			<Card.Section
				sx={{
					position: 'relative'
				}}>
				<Overlay
					gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 75%)'
					opacity={1}
					zIndex={1}
				/>
				<Box
					sx={{
						width: '100%',
						height: 180
					}}>
					<Image src={cover} alt={title} layout='fill' objectFit='cover' />
				</Box>
			</Card.Section>

			<Card.Section
				className={classes.section}
				mt='md'
				pl='calc(10% + 150px)'
				sx={{ minHeight: 120 }}>
				<Group position='apart'>
					<Text size='lg' weight={500}>
						{title}
					</Text>
					<MangaStatusBadge type={status as keyof typeof MangaStatusText} />
				</Group>
				<Spoiler maxHeight={200} showLabel='Xem thêm' hideLabel='Ẩn bớt'>
					<Text size='sm' mt='xs'>
						{description}
					</Text>
				</Spoiler>
			</Card.Section>

			<Card.Section className={classes.section}>
				<Text mt='md' color='dimmed'>
					<strong>Thể loại:</strong>{' '}
					<Box sx={{ display: 'inline-flex', gap: 4 }}>{genresDisplay}</Box>
				</Text>

				<SubInfo title='Tác giả' value={authors} />
				<SubInfo title='Đăng bởi' value={uploadBy} />
				<SubInfo
					title='Cập nhật mới nhất'
					value={relativeTimeFromNow(updated)}
				/>
				<SubInfo title='Đăng ngày' value={formatDate(created)} />

				<SubInfo title='Lượt xem' value={views.toLocaleString()} />
			</Card.Section>

			{/* ACTIONS */}

			<Group mt='xs' position='left' spacing='xs'>
				<Link href={`/manga/c/${firstChapter}`}>
					<Button disabled={!firstChapter}>Đọc từ đầu</Button>
				</Link>

				<Link href={`/manga/c/${latestChapter}`}>
					<Button disabled={!latestChapter} color='green'>
						Đọc mới nhất
					</Button>
				</Link>

				<Button color='red' leftIcon={<IconHeart size={18} stroke={1.5} />}>
					Thích truyện
				</Button>
				<Button
					color='yellow'
					leftIcon={<IconBookmark size={18} stroke={1.5} />}>
					Theo dõi truyện
				</Button>
			</Group>
		</Card>
	)
}
