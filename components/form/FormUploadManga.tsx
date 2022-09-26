import { useForm, yupResolver } from '@mantine/form'
import {
	TextInput,
	Textarea,
	Select,
	Button,
	FileInput,
	MultiSelect,
	Group
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { MangaUploadRequest } from 'types'
import { uploadMangaSchema } from 'utils'
import client from 'services/initPocketBase'
import { User } from 'pocketbase'
import useSWR from 'swr'
import { getAuthors, getGenres } from 'services/fetchers'
import toast from 'react-hot-toast'
import FileInputPreview from 'components/atoms/FileInputPreview'

type Props = {}

const MANGA_STATUS = [
	{ value: 'ONGOING', label: 'Đang tiến hành' },
	{ value: 'COMPLETED', label: 'Đã hoàn thành' },
	{ value: 'CANCELLED', label: 'Bị hủy' },
	{ value: 'PAUSED', label: 'Tạm ngưng' }
]

const FormUploadManga = () => {
	const { onSubmit, getInputProps } = useForm<MangaUploadRequest>({
		validate: yupResolver(uploadMangaSchema),
		initialValues: {
			...uploadMangaSchema.cast({}),
			upload_by: (client.authStore.model as User).profile?.id ?? ''
		}
	})

	const [isAdding, setIsAdding] = useState(false)
	const handleSubmit = async (data: MangaUploadRequest) => {
		const formData = new FormData()

		Object.keys(data).forEach((key) => {
			//@ts-ignore
			const value = data[key]
			if (Array.isArray(value) && value.length > 1) {
				for (let i = 0; i < value.length; i++) {
					formData.append(key, value[i])
				}
			} else {
				//@ts-ignore
				formData.append(key, value)
			}
		})

		setIsAdding(true)
		try {
			await client.records.create('mangas', formData)
			toast.success('Thêm mới thành công')
		} catch (error) {
			toast.error('Thêm mới thất bại')
		} finally {
			setIsAdding(false)
		}
	}

	const { data: genres, mutate: genresMutate } = useSWR('api_genres', getGenres)
	const handleGenreCreate = async (newGenre: string) => {
		try {
			const record = await client.records.create('genres', { name: newGenre })
			genresMutate([...(genres ?? []), { label: newGenre, value: record.id }])
			toast.success('Thêm thể loại mới thành công')
		} catch (error) {
			toast.success('Thêm thể loại mới thất bại')
		}
	}

	const { data: authors, mutate: authorMutate } = useSWR(
		'api_authors',
		getAuthors
	)
	const handleAuthorCreate = async (newAuthor: string) => {
		try {
			const record = await client.records.create('authors', { name: newAuthor })
			authorMutate([...(authors ?? []), { label: newAuthor, value: record.id }])
			toast.success('Thêm tác giả mới thành công')
		} catch (error) {
			toast.success('Thêm tác giả mới thất bại')
		}
	}

	return (
		<form onSubmit={onSubmit(handleSubmit)}>
			<TextInput
				label='Tên truyện'
				placeholder='Doraemon'
				withAsterisk
				{...getInputProps('title')}
			/>

			<Textarea
				label='Tóm tắt truyện'
				placeholder='Nội dung tóm tắt...'
				mt='sm'
				autosize
				minRows={4}
				{...getInputProps('description')}
			/>

			<Group>
				<FileInput
					placeholder='Chọn một ảnh bìa'
					label='Ảnh bìa'
					mt='sm'
					withAsterisk
					valueComponent={FileInputPreview}
					sx={{ flex: 1 }}
					{...getInputProps('cover')}
				/>

				<Select
					label='Trạng thái'
					placeholder='Chọn một'
					mt='sm'
					withAsterisk
					data={MANGA_STATUS}
					sx={{ flex: 1 }}
					{...getInputProps('status')}
				/>
			</Group>

			<MultiSelect
				label='Thể loại'
				placeholder='Chọn một hoặc nhiều thể loại'
				mt='sm'
				withAsterisk
				searchable
				multiple
				nothingFound='Không tìm thấy thể loại'
				maxDropdownHeight={160}
				data={genres ?? []}
				creatable
				getCreateLabel={(query) => `+ Thêm mới ${query}`}
				onCreate={handleGenreCreate}
				{...getInputProps('genres')}
			/>

			<MultiSelect
				label='Tác giả'
				placeholder='Chọn một hoặc nhiều tác giả'
				mt='sm'
				withAsterisk
				searchable
				multiple
				nothingFound='Không tìm thấy tác giả'
				maxDropdownHeight={160}
				data={authors ?? []}
				creatable
				getCreateLabel={(query) => `+ Thêm mới ${query}`}
				onCreate={handleAuthorCreate}
				{...getInputProps('author')}
			/>

			<Button type='submit' mt='lg' loading={isAdding}>
				Thêm mới
			</Button>
		</form>
	)
}

export default FormUploadManga
