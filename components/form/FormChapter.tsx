import { Button, FileInput, TextInput } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import FileInputPreview from 'components/atoms/FileInputPreview'
import { Record } from 'pocketbase'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import client from 'services/initPocketBase'
import { useSWRConfig } from 'swr'
import { Chapter, ChapterRequest } from 'types'
import { chapterSchema, transformToFormData } from 'utils'
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState'

type Props = {
	hideDrawer: () => void
	mid: string
}

const getInitialValues = (data?: Chapter | null) =>
	data
		? {
				...data,
				images: data.images.map(
					(img) =>
						`${process.env.NEXT_PUBLIC_FILES_URL}/chapter/${data.id}/${img}`
				)
		  }
		: {
				...chapterSchema.cast({})
		  }

const FormChapter = ({ hideDrawer, mid }: Props) => {
	const { mutate } = useSWRConfig()

	const {
		editData,
		isDirty: isFormDirty,
		changeDirtyStatus
	} = useFormState() as UseFormStateReturn<Chapter>

	const { onSubmit, getInputProps, isDirty, reset } = useForm<ChapterRequest>({
		validate: yupResolver(chapterSchema),
		initialValues: getInitialValues(editData)
	})

	useEffect(() => {
		if (!isFormDirty) {
			changeDirtyStatus(isDirty())
		}
	}, [changeDirtyStatus, isDirty, isFormDirty])

	const [isAdding, setIsAdding] = useState(false)
	const handleSubmit = async (data: ChapterRequest) => {
		try {
			setIsAdding(true)
			// Update
			if (editData) {
				await client.records.update(
					'chapter',
					editData.id,
					transformToFormData(data)
				)
			} else {
				// Create
				const res = await client.records.create(
					'chapter',
					transformToFormData({ ...data, belong_to: mid })
				)

				// Update chapters in manga
				client.records
					.getOne('mangas', mid)
					.then(async (mangaDetails: Record) => {
						try {
							await client.records.update('mangas', mid, {
								chapters: mangaDetails.chapters.concat(res.id)
							})
						} catch (error) {
							console.error(error)
						}
					})
					.catch(console.error)
			}
			toast.success(
				editData ? 'L??u ch???nh s???a th??nh c??ng' : 'Th??m m???i th??nh c??ng'
			)
			mutate('chapters-table')
			reset()
			hideDrawer()
		} catch (error) {
			toast.error(editData ? 'L??u ch???nh s???a th???t b???i' : 'Th??m m???i th???t b???i')
		} finally {
			setIsAdding(false)
		}
	}

	return (
		<form onSubmit={onSubmit(handleSubmit)} style={{ width: '99%' }}>
			<TextInput
				label='T??n ch????ng'
				placeholder='Chap 1'
				withAsterisk
				{...getInputProps('name')}
			/>

			<FileInput
				placeholder='Upload ???nh cho ch????ng'
				label='???nh c???a ch????ng'
				mt='sm'
				withAsterisk
				multiple
				valueComponent={FileInputPreview}
				{...getInputProps('images')}
			/>

			<Button type='submit' my='lg' loading={isAdding}>
				{editData ? 'L??u ch???nh s???a' : 'Th??m m???i'}
			</Button>
		</form>
	)
}

export default FormChapter
