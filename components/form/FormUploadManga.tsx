import {
	Button,
	FileInput,
	MultiSelect,
	Select,
	Textarea,
	TextInput
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import FileInputPreview from 'components/atoms/FileInputPreview'
import { User } from 'pocketbase'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAuthors, getGenres } from 'services/fetchers'
import client from 'services/initPocketBase'
import useSWR, { useSWRConfig } from 'swr'
import { MangaRaw, MangaUploadRequest, SWRMangaUploadFormStatus } from 'types'
import { MANGA_STATUS, transformToFormData, uploadMangaSchema } from 'utils'
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState'

type Props = {
	hideDrawer: () => void
}

const getInitialValues = (data?: SWRMangaUploadFormStatus['editData']) =>
	data
		? {
				...data,
				cover: `${process.env.NEXT_PUBLIC_FILES_URL}/mangas/${data.id}/${data.cover}`
		  }
		: {
				...uploadMangaSchema.cast({}),
				upload_by: (client.authStore.model as User).profile?.id ?? ''
		  }

const FormUploadManga = ({ hideDrawer }: Props) => {
	const { mutate } = useSWRConfig()

	const {
		editData,
		isDirty: isFormDirty,
		changeDirtyStatus
	} = useFormState() as UseFormStateReturn<MangaRaw>

	const { onSubmit, getInputProps, isDirty, reset } =
		useForm<MangaUploadRequest>({
			validate: yupResolver(uploadMangaSchema),
			initialValues: getInitialValues(editData)
		})

	useEffect(() => {
		if (!isFormDirty) {
			changeDirtyStatus(isDirty())
		}
	}, [isDirty, changeDirtyStatus, isFormDirty])

	const [isAdding, setIsAdding] = useState(false)
	const handleSubmit = async (data: MangaUploadRequest) => {
		try {
			setIsAdding(true)
			if (editData) {
				await client.records.update(
					'mangas',
					editData.id,
					transformToFormData(data)
				)
			} else {
				// Create the manga
				const manga = await client.records.create(
					'mangas',
					transformToFormData({ ...data })
				)

				// Create a row in views table
				const view = await client.records.create('views', {
					manga: manga.id
				})

				// Update the manga with the new view
				await client.records.update('mangas', manga.id, {
					view: view.id
				})
			}
			toast.success(
				editData ? 'Lưu chỉnh sửa thành công' : 'Thêm mới thành công'
			)
			mutate('uploaded-manga')
			reset()
			hideDrawer()
		} catch (error) {
			toast.error(editData ? 'Lưu chỉnh sửa thất bại' : 'Thêm mới thất bại')
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
			const record = await client.records.create('authors', {
				name: newAuthor
			})
			authorMutate([...(authors ?? []), { label: newAuthor, value: record.id }])
			toast.success('Thêm tác giả mới thành công')
		} catch (error) {
			toast.success('Thêm tác giả mới thất bại')
		}
	}

	return (
		<form onSubmit={onSubmit(handleSubmit)} style={{ width: '99%' }}>
			<TextInput
				label='Tên truyện'
				placeholder='Doraemon'
				withAsterisk
				{...getInputProps('title')}
			/>

			<Select
				label='Trạng thái'
				placeholder='Chọn một'
				mt='sm'
				withAsterisk
				data={MANGA_STATUS}
				{...getInputProps('status')}
			/>

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
				sx={{ flex: 1 }}
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
				sx={{ flex: 1 }}
			/>

			<Textarea
				label='Tóm tắt truyện'
				placeholder='Nội dung tóm tắt...'
				withAsterisk
				autosize
				minRows={5.5}
				maxRows={5.5}
				{...getInputProps('description')}
			/>

			<FileInput
				placeholder='Chọn một ảnh bìa'
				label='Ảnh bìa'
				withAsterisk
				valueComponent={FileInputPreview}
				{...getInputProps('cover')}
			/>

			<Button type='submit' my='lg' loading={isAdding}>
				{editData ? 'Lưu chỉnh sửa' : 'Thêm mới'}
			</Button>
		</form>
	)
}

export default FormUploadManga
