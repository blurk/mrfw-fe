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
				editData ? 'L??u ch???nh s???a th??nh c??ng' : 'Th??m m???i th??nh c??ng'
			)
			mutate('uploaded-manga')
			reset()
			hideDrawer()
		} catch (error) {
			toast.error(editData ? 'L??u ch???nh s???a th???t b???i' : 'Th??m m???i th???t b???i')
		} finally {
			setIsAdding(false)
		}
	}

	const { data: genres, mutate: genresMutate } = useSWR('api_genres', getGenres)

	const handleGenreCreate = async (newGenre: string) => {
		try {
			const record = await client.records.create('genres', { name: newGenre })
			genresMutate([...(genres ?? []), { label: newGenre, value: record.id }])
			toast.success('Th??m th??? lo???i m???i th??nh c??ng')
		} catch (error) {
			toast.success('Th??m th??? lo???i m???i th???t b???i')
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
			toast.success('Th??m t??c gi??? m???i th??nh c??ng')
		} catch (error) {
			toast.success('Th??m t??c gi??? m???i th???t b???i')
		}
	}

	return (
		<form onSubmit={onSubmit(handleSubmit)} style={{ width: '99%' }}>
			<TextInput
				label='T??n truy???n'
				placeholder='Doraemon'
				withAsterisk
				{...getInputProps('title')}
			/>

			<Select
				label='Tr???ng th??i'
				placeholder='Ch???n m???t'
				mt='sm'
				withAsterisk
				data={MANGA_STATUS}
				{...getInputProps('status')}
			/>

			<MultiSelect
				label='Th??? lo???i'
				placeholder='Ch???n m???t ho???c nhi???u th??? lo???i'
				mt='sm'
				withAsterisk
				searchable
				multiple
				nothingFound='Kh??ng t??m th???y th??? lo???i'
				maxDropdownHeight={160}
				data={genres ?? []}
				creatable
				getCreateLabel={(query) => `+ Th??m m???i ${query}`}
				onCreate={handleGenreCreate}
				{...getInputProps('genres')}
				sx={{ flex: 1 }}
			/>

			<MultiSelect
				label='T??c gi???'
				placeholder='Ch???n m???t ho???c nhi???u t??c gi???'
				mt='sm'
				withAsterisk
				searchable
				multiple
				nothingFound='Kh??ng t??m th???y t??c gi???'
				maxDropdownHeight={160}
				data={authors ?? []}
				creatable
				getCreateLabel={(query) => `+ Th??m m???i ${query}`}
				onCreate={handleAuthorCreate}
				{...getInputProps('author')}
				sx={{ flex: 1 }}
			/>

			<Textarea
				label='T??m t???t truy???n'
				placeholder='N???i dung t??m t???t...'
				withAsterisk
				autosize
				minRows={5.5}
				maxRows={5.5}
				{...getInputProps('description')}
			/>

			<FileInput
				placeholder='Ch???n m???t ???nh b??a'
				label='???nh b??a'
				withAsterisk
				valueComponent={FileInputPreview}
				{...getInputProps('cover')}
			/>

			<Button type='submit' my='lg' loading={isAdding}>
				{editData ? 'L??u ch???nh s???a' : 'Th??m m???i'}
			</Button>
		</form>
	)
}

export default FormUploadManga
