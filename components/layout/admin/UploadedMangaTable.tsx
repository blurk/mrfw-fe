import { Anchor, Loader, Modal, Text, Group, Button } from '@mantine/core'
import { Suspense, useState } from 'react'
import { uploadedMangaByUser } from 'services/fetchers'
import client from 'services/initPocketBase'
import useSWR, { mutate } from 'swr'
import { MangaList, MangaRaw } from 'types'

import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import BaseTable from 'components/atoms/BaseTable'
import MangaStatusBadge from 'components/atoms/MangaStatusBadge'
import Link from 'next/link'
import { formatDate, MangaStatusText } from 'utils'
import { useDisclosure } from '@mantine/hooks'
import toast from 'react-hot-toast'

type Props = {
	showDrawer: () => void
}

const columnHelper = createColumnHelper<MangaRaw>()

const columns = [
	columnHelper.accessor('title', {
		header: 'Tên truyện',
		cell: (info) => (
			<Link href={`/manga/${info.row.original.id}`}>
				<Anchor>{info.getValue()}</Anchor>
			</Link>
		)
	}),
	columnHelper.accessor('@expand.author', {
		header: 'Tác giả',
		cell: (info) =>
			info
				.getValue()
				.map((author) => author.name)
				.join(',')
	}),
	columnHelper.accessor('status', {
		header: 'Trạng thái',
		cell: (info) => (
			<MangaStatusBadge
				type={info.getValue() as keyof typeof MangaStatusText}
			/>
		)
	}),
	columnHelper.accessor('chapters', {
		header: 'Số chương',
		cell: (info) => <Text align='center'>{info.getValue().length}</Text>
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

const UploadedMangaTable = ({ showDrawer }: Props) => {
	const { data } = useSWR<MangaList>('uploaded-manga', uploadedMangaByUser, {
		isPaused: () => client.authStore.model == null,
		suspense: true
	})

	const { data: uploadMangaFormStatus, mutate: updateUploadMangaFormStatus } =
		useSWR('upload-manga-form-status')

	const table = useReactTable({
		data: data?.items ?? [],
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	const [currentManga, setCurrentManga] = useState<MangaRaw | null>(null)

	const onEdit = (row: MangaRaw) => {
		updateUploadMangaFormStatus({
			...uploadMangaFormStatus,
			editData: row
		})
		showDrawer()
	}
	const onChapterManagement = (row: MangaRaw) => {}

	const [isDeleteModalOpen, deleteModalOpenHandlers] = useDisclosure(false)

	const onDelete = (row: MangaRaw) => {
		setCurrentManga(row)
		deleteModalOpenHandlers.open()
	}

	const onDeleteConfirm = async () => {
		if (currentManga) {
			await toast.promise(client.records.delete('mangas', currentManga.id), {
				loading: 'Đang xóa truyện...',
				success: 'Xóa truyện thành công',
				error: 'Xóa truyện thất bại'
			})
			mutate('uploaded-manga')
		}

		deleteModalOpenHandlers.close()
	}

	return (
		<>
			<Modal
				centered
				opened={isDeleteModalOpen}
				onClose={deleteModalOpenHandlers.close}
				withCloseButton={false}
				title={
					<Text>
						Bạn có muốn xóa truyện{' '}
						<Text component='span' color='blue'>
							{currentManga?.title ?? ''}
						</Text>{' '}
						không?
					</Text>
				}>
				<Group position='right'>
					<Button color='blue' onClick={onDeleteConfirm}>
						Có
					</Button>
					<Button color='red' onClick={deleteModalOpenHandlers.close}>
						Không
					</Button>
				</Group>
			</Modal>

			<Suspense fallback={<Loader />}>
				<BaseTable
					table={table}
					onEdit={onEdit}
					onChapterManagement={onChapterManagement}
					onDelete={onDelete}
				/>
			</Suspense>
		</>
	)
}

export default UploadedMangaTable
