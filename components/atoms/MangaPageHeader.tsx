import {
	Button,
	Collapse,
	Group,
	MultiSelect,
	Paper,
	Select,
	TextInput
} from '@mantine/core'
import { IconArrowsSort, IconCategory, IconSearch } from '@tabler/icons'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Props = {
	genresData: { value: string; label: string }[]
}

const MangaPageHeader = ({ genresData }: Props) => {
	const { query } = useRouter()

	const sortBy = (query?.sortBy ?? 'title') as string
	const searchText = (query?.searchText ?? '') as string
	const genres = (query?.genreId ?? '') as string

	const [isAdvanced, setIsAdvanced] = useState(() => Boolean(genres))

	return (
		<Paper mt='md' p='sm'>
			<Group>
				<Select
					icon={<IconArrowsSort size={18} />}
					label='Sắp xếp theo'
					placeholder='Chọn một'
					name='sortBy'
					defaultValue={sortBy}
					data={[
						{ label: 'Tên từ A - Z', value: 'title' },
						{ label: 'Tên từ Z - A', value: '-title' },
						{ label: 'Truyện mới cập nhật', value: '-updated' },
						{ label: 'Truyện mới đăng', value: '-created' },
						{ label: 'Truyện đã đăng từ lâu', value: 'created' }
					]}
				/>

				<TextInput
					label='Từ khóa'
					placeholder='Nhập tên từ khóa'
					name='searchText'
					defaultValue={searchText}
					icon={<IconSearch size={18} />}
					sx={{ flex: 1 }}
				/>

				<Button type='submit' mt='xl'>
					Tìm kiếm
				</Button>

				<Button
					mt='xl'
					variant='outline'
					onClick={() => setIsAdvanced((o) => !o)}>
					Nâng cao
				</Button>

				<Collapse in={isAdvanced} sx={{ width: '100%' }}>
					<MultiSelect
						icon={<IconCategory size={18} />}
						label='Thể loại'
						placeholder='Chọn nhiều'
						name='genreId'
						multiple
						defaultValue={genres.split(',')}
						data={genresData}
						disabled={!isAdvanced}
					/>
				</Collapse>
			</Group>
		</Paper>
	)
}

export default MangaPageHeader
