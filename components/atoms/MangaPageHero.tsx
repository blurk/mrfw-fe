import {
	createStyles,
	Overlay,
	Container,
	Title,
	Button,
	Text,
	Group,
	Spoiler
} from '@mantine/core'
import { IconEye } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
	hero: {
		position: 'relative',
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},

	container: {
		height: 300,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		paddingBottom: theme.spacing.xl * 3,
		zIndex: 1,
		position: 'relative',

		[theme.fn.smallerThan('sm')]: {
			height: 200,
			paddingBottom: theme.spacing.xl * 2
		}
	},

	title: {
		color: theme.white,
		fontSize: 60,
		fontWeight: 900,
		lineHeight: 1.1,

		[theme.fn.smallerThan('sm')]: {
			fontSize: 40,
			lineHeight: 1.2
		},

		[theme.fn.smallerThan('xs')]: {
			fontSize: 28,
			lineHeight: 1.3
		}
	},

	description: {
		color: theme.white,
		maxWidth: '50%',

		[theme.fn.smallerThan('sm')]: {
			maxWidth: '100%',
			fontSize: theme.fontSizes.sm
		}
	}
}))

interface Props {
	title: string
	cover: string
	author: string
}

export function MangaPageHero({ title, author, cover }: Props) {
	const { classes } = useStyles()

	return (
		<div
			className={classes.hero}
			style={{
				backgroundImage: `url('${cover}')`
			}}>
			<Overlay
				gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)'
				opacity={1}
				zIndex={0}
			/>
			<Container className={classes.container}>
				<Title className={classes.title}>{title}</Title>
				<Text className={classes.description}>{author}</Text>

				<Group mt='sm'>
					<Button variant='gradient' leftIcon={<IconEye size={18} />}>
						Đọc từ đầu
					</Button>

					<Button
						variant='gradient'
						gradient={{ from: 'green.8', to: 'green.4' }}
						leftIcon={<IconEye size={18} />}>
						Đọc mới nhất
					</Button>
				</Group>
			</Container>
		</div>
	)
}
