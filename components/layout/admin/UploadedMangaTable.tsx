import {
	Anchor,
	Loader,
	Table,
	ActionIcon,
	Tooltip,
	Group,
	Text
} from '@mantine/core'
import React, { Suspense } from 'react'
import { uploadedMangaByUser } from 'services/fetchers'
import client from 'services/initPocketBase'
import useSWR from 'swr'
import { MangaList, MangaRaw } from 'types'

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import Link from 'next/link'
import MangaStatusBadge from 'components/atoms/MangaStatusBadge'
import { formatDate, MangaStatusText } from 'utils'
import { IconEdit, IconList, IconTrash } from '@tabler/icons'

type Props = {}

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

const UploadedMangaTable = (props: Props) => {
	const { data } = useSWR<MangaList>('uploaded-manga', uploadedMangaByUser, {
		isPaused: () => client.authStore.model == null,
		suspense: true
	})

	const table = useReactTable({
		data: data?.items ?? [],
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	return (
		<Suspense fallback={<Loader />}>
			<Table>
				{/* TABLE HEAD */}
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</th>
							))}
							{/* ACTIONS HEADER */}
							<th></th>
						</tr>
					))}
				</thead>
				{/* TABLE BODY */}
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
							{/* ACTIONS */}
							<td>
								<Group>
									<Tooltip label='Chỉnh sửa truyện'>
										<ActionIcon color='green'>
											<IconEdit size={18} />
										</ActionIcon>
									</Tooltip>

									<Tooltip label='Quản lý chương'>
										<ActionIcon color='blue'>
											<IconList size={18} />
										</ActionIcon>
									</Tooltip>

									<Tooltip label='Xóa truyện'>
										<ActionIcon color='red'>
											<IconTrash size={18} />
										</ActionIcon>
									</Tooltip>
								</Group>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Suspense>
	)
}

export default UploadedMangaTable
