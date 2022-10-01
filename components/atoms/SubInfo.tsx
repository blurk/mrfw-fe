import { Text } from '@mantine/core'

interface SubInfoProps {
	title: string
	value: string
}

const SubInfo = ({ title, value }: SubInfoProps) => (
	<Text mt='md' color='dimmed'>
		<strong>{title}:</strong> {value}
	</Text>
)

export default SubInfo
