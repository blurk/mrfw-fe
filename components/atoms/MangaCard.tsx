import { IconBookmark, IconHeart, IconShare, IconUser } from '@tabler/icons'
import {
	Card,
	Text,
	ActionIcon,
	Badge,
	Group,
	Center,
	Avatar,
	createStyles,
	Tooltip,
	Anchor
} from '@mantine/core'
import { Manga } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from 'utils'

const useStyles = createStyles((theme) => ({
	card: {
		position: 'relative',
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
	},

	cover: {
		position: 'relative',
		height: 180,
		width: '100%',
		aspectRatio: '1',
		display: 'block'
	},

	rating: {
		position: 'absolute',
		top: theme.spacing.xs,
		right: theme.spacing.xs + 2,
		pointerEvents: 'none'
	},

	title: {
		marginTop: theme.spacing.md,
		marginBottom: theme.spacing.xs / 2
	},

	action: {
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.colors.dark[6]
				: theme.colors.gray[0],
		...theme.fn.hover({
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[5]
					: theme.colors.gray[1]
		})
	},

	footer: {
		marginTop: theme.spacing.md
	}
}))

interface Props extends Manga {}

export const MangaCard = ({
	cover,
	id,
	title,
	description,
	collectionId,
	expand
}: Props) => {
	const { classes, theme } = useStyles()

	const href = `/manga/${id}`

	return (
		<Card withBorder radius='md' className={classes.card}>
			<Card.Section>
				<Link href={href} passHref>
					<Anchor className={classes.cover}>
						<Image
							src={getImageUrl(collectionId, id, cover)}
							alt={title}
							layout='fill'
							objectFit='cover'
							objectPosition='center'
							priority
						/>
					</Anchor>
				</Link>
			</Card.Section>

			<Badge
				className={classes.rating}
				variant='gradient'
				color='red'
				gradient={{ from: 'red.4', to: 'red.8' }}>
				mới cập nhật
			</Badge>

			<Link href={href} passHref>
				<Text
					className={classes.title}
					weight={500}
					component='a'
					variant='link'
					lineClamp={1}
					title={title}>
					{title}
				</Text>
			</Link>

			<Text size='sm' color='dimmed' lineClamp={4}>
				{description}
			</Text>

			<Group position='apart' className={classes.footer}>
				<Center>
					{expand?.upload_by?.avatar ? (
						<Avatar
							src={getImageUrl(collectionId, id, expand.upload_by.avatar)}
							size={24}
							radius='xl'
							mr='xs'
						/>
					) : (
						<IconUser size={18} />
					)}

					<Text size='sm' inline ml={4}>
						{expand?.upload_by?.name ?? 'Ẩn Danh'}
					</Text>
				</Center>

				<Group spacing={8}>
					<Tooltip label='Thích truyện' withArrow>
						<ActionIcon className={classes.action} aria-label='Thích truyện'>
							<IconHeart size={16} color={theme.colors.red[6]} />
						</ActionIcon>
					</Tooltip>

					<Tooltip label='Bookmark' withArrow>
						<ActionIcon className={classes.action} aria-label='Bookmark'>
							<IconBookmark size={16} color={theme.colors.yellow[7]} />
						</ActionIcon>
					</Tooltip>

					<Tooltip label='Chia sẻ' withArrow>
						<ActionIcon className={classes.action} aria-label='Chia sẻ'>
							<IconShare size={16} />
						</ActionIcon>
					</Tooltip>

					<div></div>
				</Group>
			</Group>
		</Card>
	)
}
