import { Box, Button, Group, Title, Drawer } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { IconBookUpload } from '@tabler/icons'
import FormUploadManga from 'components/form/FormUploadManga'
import { useState } from 'react'
import UploadedMangaTable from './UploadedMangaTable'

type Props = {}

const MangaManagementLayout = ({}: Props) => {
	const [showDrawer, toggleDrawer] = useToggle([false, true] as const)

	const handleDrawerClose = () => {
		toggleDrawer(false)
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
					onClick={() => toggleDrawer(true)}>
					Thêm truyện
				</Button>
			</Group>

			<Box mt='lg' p='sm' sx={{ backgroundColor: 'white' }}>
				<UploadedMangaTable />
			</Box>

			{/* ADD DRAWER */}
			<Drawer
				title='Thêm truyện'
				padding='xl'
				size='75%'
				position='right'
				overlayOpacity={0.55}
				overlayBlur={3}
				opened={showDrawer}
				onClose={handleDrawerClose}>
				<FormUploadManga />
			</Drawer>
		</Box>
	)
}

export default MangaManagementLayout
