import { FileInputProps, Group, Center } from '@mantine/core'
import { IconPhoto } from '@tabler/icons'

function FilePreview({ file }: { file: File }) {
	return (
		<Center
			inline
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === 'dark'
						? theme.colors.dark[7]
						: theme.colors.gray[1],
				fontSize: theme.fontSizes.xs,
				padding: '3px 7px',
				borderRadius: theme.radius.sm
			})}>
			<IconPhoto size={14} style={{ marginRight: 5 }} />
			<span
				style={{
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
					overflow: 'hidden',
					maxWidth: 200,
					display: 'inline-block'
				}}>
				{file.name}
			</span>
		</Center>
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
