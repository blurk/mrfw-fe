import {
	Button,
	FileButton,
	Group,
	List,
	TextInput,
	Text,
	Box,
	FileInput
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import FileInputPreview, {
	FilePreview
} from 'components/atoms/FileInputPreview'
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
	chaptersId: string[]
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

const FormChapter = ({ hideDrawer, mid, chaptersId }: Props) => {
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
				await client.records.update('mangas', mid, {
					chapters: chaptersId.concat(res.id)
				})
			}
			toast.success(
				editData ? 'Lưu chỉnh sửa thành công' : 'Thêm mới thành công'
			)
			mutate(mid)
			reset()
			hideDrawer()
		} catch (error) {
			toast.error(editData ? 'Lưu chỉnh sửa thất bại' : 'Thêm mới thất bại')
		} finally {
			setIsAdding(false)
		}
	}

	return (
		<form onSubmit={onSubmit(handleSubmit)} style={{ width: '99%' }}>
			<TextInput
				label='Tên chương'
				placeholder='Chap 1'
				withAsterisk
				{...getInputProps('name')}
			/>

			<FileInput
				placeholder='Upload ảnh cho chương'
				label='Ảnh của chương'
				mt='sm'
				withAsterisk
				multiple
				valueComponent={FileInputPreview}
				{...getInputProps('images')}
			/>

			<Button type='submit' my='lg' loading={isAdding}>
				{editData ? 'Lưu chỉnh sửa' : 'Thêm mới'}
			</Button>
		</form>
	)
}

export default FormChapter
