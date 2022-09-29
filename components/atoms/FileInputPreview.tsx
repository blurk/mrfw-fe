import { FileInputProps, Box, SimpleGrid, ScrollArea } from '@mantine/core'
import Image from 'next/image'
import { memo } from 'react'

export function FilePreview({ file }: { file: File | string }) {
	const imageUrl = typeof file !== 'string' ? URL.createObjectURL(file) : file

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				aspectRatio: '2/3'
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
	if (!value) {
		return null
	}

	if (Array.isArray(value)) {
		return (
			<ScrollArea type='auto' style={{ height: 300 }}>
				<SimpleGrid
					cols={4}
					breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
					mt={value.length > 0 ? 'xl' : 0}>
					{value.map((file, index) => (
						<FilePreview file={file} key={index} />
					))}
				</SimpleGrid>
			</ScrollArea>
		)
	}

	return <FilePreview file={value} />
}

export default memo(FileInputPreview, function (prevProps, nextProps) {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
