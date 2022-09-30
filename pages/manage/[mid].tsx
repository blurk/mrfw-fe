import { Box, Button, Drawer, Group, ScrollArea, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconArrowBack, IconPlus } from '@tabler/icons'
import FormChapter from 'components/form/FormChapter'
import ManageChaptersTable from 'components/layout/manage/ChapterTable'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Chapter } from 'types'
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState'

type Props = {
	mid: string
}

const PageMid = ({ mid }: Props) => {
	const { editData, reset } = useFormState() as UseFormStateReturn<Chapter>

	const [isDrawerOpen, drawerHandlers] = useDisclosure(false)

	const handleDrawerClose = () => {
		drawerHandlers.close()
		reset()
	}

	return (
		<>
			<Head>
				<title>Quản lý chương</title>
			</Head>

			<Link href='/manage'>
				<Button variant='subtle' leftIcon={<IconArrowBack />}>
					Quay lại trang quản lý truyện
				</Button>
			</Link>

			<Title order={1} mt='md' color='gray.8'>
				Quản lý chương
			</Title>

			<Box mt='md' pb='30vh'>
				<Group position='apart'>
					<Title order={2} color='gray.7'>
						Danh sách chương đã đăng
					</Title>

					<Button
						variant='gradient'
						gradient={{ from: 'indigo', to: 'cyan' }}
						leftIcon={<IconPlus size={18} />}
						onClick={drawerHandlers.open}>
						Thêm chương mới
					</Button>
				</Group>

				<Box mt='lg' p='sm' sx={{ backgroundColor: 'white' }}>
					<ManageChaptersTable showDrawer={drawerHandlers.open} mid={mid} />
				</Box>
			</Box>

			{/* ADD DRAWER */}
			<Drawer
				title={editData ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
				padding='xl'
				size='50%'
				position='right'
				overlayOpacity={0.55}
				overlayBlur={3}
				opened={isDrawerOpen}
				onClose={handleDrawerClose}>
				{/* FORM */}
				<ScrollArea type='hover' style={{ height: '80vh', width: '100%' }}>
					<FormChapter hideDrawer={drawerHandlers.close} mid={mid} />
				</ScrollArea>
			</Drawer>
		</>
	)
}

export default PageMid

export const getServerSideProps = ({ query }: GetServerSidePropsContext) => {
	return {
		props: {
			mid: query.mid
		}
	}
}
