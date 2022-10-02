import { IconBookmark, IconEye, IconHeart, IconUser } from '@tabler/icons'
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
	Anchor,
	Space
} from '@mantine/core'
import { Manga } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from 'utils'
import client from 'services/initPocketBase'
import MangaCardFooter from './MangaCardFooter'

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

	badge: {
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

interface Props extends Manga {
	badgeText?: string
	accentColor?: string
}

export const MangaCard = ({
	cover,
	id,
	title,
	description,
	collectionId,
	expand,
	badgeText,
	accentColor
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

			{badgeText && (
				<Badge
					className={classes.badge}
					variant='gradient'
					color='red'
					gradient={{ from: `${accentColor}.4`, to: `${accentColor}.8` }}>
					{badgeText}
				</Badge>
			)}

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

			<Text size='sm' color='dimmed' lineClamp={4} sx={{ height: 86 }}>
				{description}
			</Text>

			{/* FOOTER */}
			<Group position='apart' className={classes.footer}>
				<Center>
					<Tooltip
						label={`Đăng bởi ${expand?.upload_by?.name ?? 'người dùng'}`}
						withArrow>
						<Group spacing={2}>
							{expand?.upload_by?.avatar ? (
								<Avatar
									src={getImageUrl(
										'profiles',
										expand.upload_by.id,
										expand.upload_by.avatar
									)}
									size={24}
									radius='xl'
								/>
							) : (
								<IconUser size={18} />
							)}

							<Text
								size='sm'
								inline
								ml={4}
								sx={{ maxWidth: '10ch' }}
								lineClamp={1}>
								{expand?.upload_by?.name ?? 'người dùng'}
							</Text>
						</Group>
					</Tooltip>

					<Space w='xs' />
					<Tooltip label='Lượt xem' withArrow>
						<Center>
							<IconEye size={18} />
							<Text size='sm' inline ml={4}>
								{expand?.view.count ?? 0}
							</Text>
						</Center>
					</Tooltip>
				</Center>

				<MangaCardFooter classes={classes.action} mangaId={id} />
			</Group>
		</Card>
	)
}
