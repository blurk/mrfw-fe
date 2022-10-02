import {
	ActionIcon,
	Button,
	Dialog,
	Group,
	Text,
	Tooltip,
	useMantineTheme
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBookmark, IconHeart } from '@tabler/icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import client from 'services/initPocketBase'
import { useSWRConfig } from 'swr'
import { Profile } from 'types'
import { useSession } from 'utils'

type Props = {
	classes?: string
	mangaId: string
}

const MangaCardFooter = ({ classes = '', mangaId }: Props) => {
	const { user } = useSession()
	const { mutate } = useSWRConfig()

	const theme = useMantineTheme()

	const [opened, { close, open }] = useDisclosure(false)

	const withNotLogin = (fn: () => void) => () => {
		if (client.authStore.isValid) {
			fn()
		} else {
			open()
		}
	}

	const onLike = withNotLogin(async () => {
		toast('Chức năng đang hoàn thiện')
	})

	const onBookmark = withNotLogin(async () => {
		if (user && user.profile) {
			const profile = user.profile as unknown as Profile
			const bookmark = profile?.bookmark ?? []

			try {
				toast.promise(
					client.records.update('profiles', profile.id, {
						bookmark: [...bookmark, mangaId]
					}),
					{
						loading: 'Đang lưu truyện...',
						success: () => {
							mutate('api_user')
							return 'Thêm thành công'
						},
						error: 'Thêm thất bại'
					}
				)
			} catch (error) {}
		}
	})

	return (
		<>
			<Dialog
				opened={opened}
				withCloseButton
				onClose={close}
				size='lg'
				radius='md'>
				<Text size='sm' style={{ marginBottom: 10 }} weight={500}>
					Hãy đăng nhập để thực hiện chức năng này nhé
				</Text>

				<Group align='flex-end'>
					<Link href='/login'>
						<Button onClick={close}>Đăng nhập</Button>
					</Link>
				</Group>
			</Dialog>

			<Group spacing={8} mt='auto'>
				<Tooltip label='Thích truyện' withArrow>
					<ActionIcon
						className={classes}
						aria-label='Thích truyện'
						onClick={onLike}>
						<IconHeart size={16} color={theme.colors.red[6]} />
					</ActionIcon>
				</Tooltip>

				<Tooltip label='Theo dõi truyện' withArrow withinPortal>
					<ActionIcon
						className={classes}
						aria-label='Theo dõi truyện'
						onClick={onBookmark}>
						<IconBookmark
							size={16}
							color={theme.colors.yellow[7]}
							fill={
								user?.profile?.bookmark?.includes(mangaId)
									? theme.colors.yellow[7]
									: 'transparent'
							}
						/>
					</ActionIcon>
				</Tooltip>
			</Group>
		</>
	)
}

export default MangaCardFooter
