import {
	Box,
	Button,
	Drawer,
	Group,
	Modal,
	ScrollArea,
	Text,
	Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBookUpload } from '@tabler/icons'
import FormUploadManga from 'components/form/FormUploadManga'
import { MangaRaw } from 'types'
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState'
import UploadedMangaTable from './UploadedMangaTable'

type Props = {}

const MangaManagementLayout = ({}: Props) => {
	const { isDirty, editData } = useFormState() as UseFormStateReturn<MangaRaw>

	const [isDrawerOpen, drawerHandlers] = useDisclosure(false)
	const [isModalOpen, modalHandlers] = useDisclosure(false)

	const handleDrawerClose = () => {
		if (isDirty) {
			modalHandlers.open()
		} else {
			drawerHandlers.close()
		}
	}

	return (
		<Box mt='md'>
			<Group position='apart'>
				<Title order={2} color='gray.7'>
					Truyện đã đăng
				</Title>

				<Button
					variant='gradient'
					gradient={{ from: 'indigo', to: 'cyan' }}
					leftIcon={<IconBookUpload size={18} />}
					onClick={drawerHandlers.open}>
					Thêm truyện
				</Button>
			</Group>

			<Box mt='lg' p='sm' sx={{ backgroundColor: 'white' }}>
				<UploadedMangaTable showDrawer={drawerHandlers.open} />
			</Box>

			{/* ADD DRAWER */}
			<Drawer
				title={editData ? 'Chỉnh sửa truyện' : 'Thêm truyện'}
				padding='xl'
				size='50%'
				position='right'
				overlayOpacity={0.55}
				overlayBlur={3}
				opened={isDrawerOpen}
				onClose={handleDrawerClose}>
				{/* DISCARD MODAL */}
				<Modal
					size='sm'
					centered
					title={
						<Title order={3} color='dark.7'>
							Có thay đổi chưa được lưu
						</Title>
					}
					withCloseButton={false}
					opened={isModalOpen}
					onClose={modalHandlers.close}>
					<Text size='md'>Bạn có chắc là muốn thoát không?</Text>
					<Group mt='md' position='right'>
						<Button variant='subtle' color='dark' onClick={modalHandlers.close}>
							Không
						</Button>
						<Button
							color='red'
							onClick={() => {
								modalHandlers.close()
								drawerHandlers.close()
							}}>
							Có
						</Button>
					</Group>
				</Modal>
				<ScrollArea type='hover' style={{ height: '80vh', width: '100%' }}>
					<FormUploadManga hideDrawer={drawerHandlers.close} />
				</ScrollArea>
			</Drawer>
		</Box>
	)
}

export default MangaManagementLayout
