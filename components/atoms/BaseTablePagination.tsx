import {
	ActionIcon,
	Group,
	Input,
	NumberInput,
	Select,
	Text
} from '@mantine/core'
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight
} from '@tabler/icons'
import { Table } from '@tanstack/react-table'
import { PER_PAGE_OPTIONS } from 'utils'

interface TablePaginationProps<T> {
	table: Table<T>
}

const BaseTablePagination = <T,>({ table }: TablePaginationProps<T>) => {
	return (
		<Group spacing={2} mt='md'>
			<ActionIcon
				onClick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}>
				<IconChevronsLeft />
			</ActionIcon>
			<ActionIcon
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}>
				<IconChevronLeft />
			</ActionIcon>
			<ActionIcon
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}>
				<IconChevronRight />
			</ActionIcon>
			<ActionIcon
				onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}>
				<IconChevronsRight />
			</ActionIcon>
			<Group spacing={4}>
				<Text>Trang</Text>
				<Text weight={600}>
					{table.getState().pagination.pageIndex + 1} của {table.getPageCount()}
				</Text>
			</Group>
			<Group spacing='sm' ml='auto'>
				<Text>Đi tới trang</Text>
				<NumberInput
					max={table.getPageCount()}
					min={1}
					defaultValue={table.getState().pagination.pageIndex + 1}
					onChange={(value: number) => {
						const page = value ? value - 1 : 0
						table.setPageIndex(page)
					}}
				/>
				<Select
					defaultValue={table.getState().pagination.pageSize.toString()}
					data={PER_PAGE_OPTIONS}
					onChange={(value) => {
						table.setPageSize(Number(value))
					}}
				/>
			</Group>
		</Group>
	)
}

export default BaseTablePagination
