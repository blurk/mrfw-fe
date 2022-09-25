import { Box, Button, Group, Title } from '@mantine/core'
import { IconBookUpload } from '@tabler/icons'
import UploadedMangaTable from './UploadedMangaTable'

type Props = {}

const MangaManagementLayout = ({}: Props) => {
	return (
		<Box mt='md'>
			<Group position='apart'>
				<Title order={2} color='gray.7'>
					Truyện đã đăng
				</Title>

				<Button
					variant='gradient'
					gradient={{ from: 'indigo', to: 'cyan' }}
					leftIcon={<IconBookUpload size={18} />}>
					Thêm truyện
				</Button>
			</Group>

			<Box mt='sm' p='sm' sx={{ backgroundColor: 'white' }}>
				<UploadedMangaTable />
			</Box>
		</Box>
	)
}

export default MangaManagementLayout
