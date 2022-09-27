import { flexRender, Table } from '@tanstack/react-table'
import {
	Table as MantineTable,
	Group,
	Tooltip,
	ActionIcon
} from '@mantine/core'
import { IconEdit, IconList, IconTrash } from '@tabler/icons'
import React, { MouseEvent } from 'react'

const withEvent =
	(fn: Function, ...fnArgs: any[]) =>
	(event: MouseEvent<HTMLButtonElement>) => {
		fn.call(null, ...fnArgs)
	}

interface Props<T> {
	table: Table<T>
	onEdit: (rowData: T) => void
	onChapterManagement: (rowData: T) => void
	onDelete: (rowData: T) => void
}

const BaseTable = <T,>({
	table,
	onEdit,
	onChapterManagement,
	onDelete
}: Props<T>) => {
	return (
		<MantineTable>
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
									<ActionIcon
										color='green'
										onClick={withEvent(onEdit, row.original)}>
										<IconEdit size={18} />
									</ActionIcon>
								</Tooltip>

								<Tooltip label='Quản lý chương'>
									<ActionIcon
										color='blue'
										onClick={withEvent(onChapterManagement, row.original)}>
										<IconList size={18} />
									</ActionIcon>
								</Tooltip>

								<Tooltip label='Xóa truyện'>
									<ActionIcon
										color='red'
										onClick={withEvent(onDelete, row.original)}>
										<IconTrash size={18} />
									</ActionIcon>
								</Tooltip>
							</Group>
						</td>
					</tr>
				))}
			</tbody>
		</MantineTable>
	)
}

export default BaseTable
