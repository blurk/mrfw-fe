import { FileInputProps, Group, Box } from '@mantine/core'
import Image from 'next/image'

function FilePreview({ file }: { file: File | string }) {
	const imageUrl = typeof file !== 'string' ? URL.createObjectURL(file) : file

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				aspectRatio: '1'
			}}>
			<Image
				src={imageUrl}
				alt='preview'
				layout='fill'
				objectFit='cover'
				objectPosition='center'
			/>
		</Box>
	)
}

const FileInputPreview: FileInputProps['valueComponent'] = ({ value }) => {
	if (Array.isArray(value)) {
		return (
			<Group spacing='sm' py='xs'>
				{value.map((file, index) => (
					<FilePreview file={file} key={index} />
				))}
			</Group>
		)
	}

	if (!value) {
		return null
	}

	return <FilePreview file={value} />
}

export default FileInputPreview
