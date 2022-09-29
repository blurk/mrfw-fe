import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	Drawer,
	Group,
	Loader,
	ScrollArea,
	Title,
	Tooltip
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconArrowBack, IconEdit, IconTrash, IconPlus } from '@tabler/icons'
import {
	CellContext,
	createColumnHelper,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import BaseTable from 'components/atoms/BaseTable'
import ModalTitleWithAccent from 'components/atoms/ModalTitleWithAccent'
import FormChapter from 'components/form/FormChapter'
import { DeleteModal } from 'components/molecules/DeleteModal'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Suspense, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { getChaptersOfManga } from 'services/fetchers'
import client from 'services/initPocketBase'
import useSWR, { useSWRConfig } from 'swr'
import { Chapter } from 'types'
import { formatDate } from 'utils'
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState'

type Props = {
	mid: string
}

const columnHelper = createColumnHelper<Chapter>()

const columns = [
	columnHelper.accessor('name', {
		header: 'Tên chương',
		cell: (info) => (
			<Link href={`/manga/c/${info.row.original.id}`}>
				<Anchor>{info.getValue()}</Anchor>
			</Link>
		)
	}),
	columnHelper.accessor('created', {
		header: 'Ngày đăng',
		cell: (info) => formatDate(info.getValue())
	}),
	columnHelper.accessor('updated', {
		header: 'Ngày cập nhật',
		cell: (info) => formatDate(info.getValue())
	})
]

const PageMid = ({ mid }: Props) => {
	const { data } = useSWR(mid, getChaptersOfManga, {
		isPaused: () => client.authStore.model == null,
		suspense: true
	})

	const { isDirty, editData, reset, changeDirtyStatus, updateEditData } =
		useFormState() as UseFormStateReturn<Chapter>

	const [isDeleteModalShow, deleteModalHandlers] = useDisclosure(false)
	const [isDrawerOpen, drawerHandlers] = useDisclosure(false)

	const handleDrawerClose = () => {
		drawerHandlers.close()
		reset()
	}

	const onEdit = useCallback(
		(row: Chapter) => {
			drawerHandlers.open()
			updateEditData(row)
		},
		[drawerHandlers, updateEditData]
	)

	const onDelete = useCallback(
		(row: Chapter) => {
			updateEditData(row)
			deleteModalHandlers.open()
		},
		[deleteModalHandlers, updateEditData]
	)

	const { mutate } = useSWRConfig()

	const onDeleteConfirm = async () => {
		try {
			if (editData?.id) {
				await toast.promise(client.records.delete('chapter', editData?.id), {
					loading: 'Đang xóa chương...',
					success: 'Xóa chương thành công',
					error: 'Xóa chương thất bại'
				})

				updateEditData(null)
			}

			mutate(mid)
		} catch (error) {
			console.log(error)
		}

		deleteModalHandlers.close()
	}

	const chaptersId = useMemo(
		() => (data?.items ? data?.items.map((c) => c.id) : []),
		[data?.items]
	)

	const columnsWithActions = useMemo(() => {
		return [
			...columns,
			{
				id: 'action',
				header: 'Thao tác',
				cell: ({ row }: CellContext<Chapter, any>) => {
					return (
						<Group noWrap>
							<Tooltip label='Chỉnh sửa chương'>
								<ActionIcon
									color='green'
									onClick={onEdit.bind(null, row.original)}>
									<IconEdit size={18} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label='Xóa chương'>
								<ActionIcon
									color='red'
									onClick={onDelete.bind(null, row.original)}>
									<IconTrash size={18} />
								</ActionIcon>
							</Tooltip>
						</Group>
					)
				}
			}
		]
	}, [onDelete, onEdit])

	const table = useReactTable({
		data: data?.items ?? [],
		columns: columnsWithActions,
		getCoreRowModel: getCoreRowModel()
	})

	return (
		<>
			<Head>
				<title>Quản lý chương</title>
			</Head>

			<DeleteModal
				isShow={isDeleteModalShow}
				onClose={deleteModalHandlers.close}
				// TODO: Update onConfirm logic
				onConfirm={onDeleteConfirm}
				title={
					<ModalTitleWithAccent
						before='Bạn có chắc là muốn xoá chương'
						value={editData?.name}
						after='không?'
					/>
				}
			/>

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
					<Suspense fallback={<Loader />}>
						<BaseTable table={table} />
					</Suspense>
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
					<FormChapter
						hideDrawer={drawerHandlers.close}
						mid={mid}
						chaptersId={chaptersId}
					/>
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
