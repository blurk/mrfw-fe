import { Player } from '@lottiefiles/react-lottie-player'
import { Autocomplete, Group, Text } from '@mantine/core'
import Router from 'next/router'
import { useEffect, useState } from 'react'

type Props = {
	defaultValue: string
	data: { value: string; label: string }[]
}

const ChapterSelection = ({ defaultValue, data }: Props) => {
	const [value, setValue] = useState(defaultValue)

	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])

	return (
		<Autocomplete
			style={{
				flex: 1
			}}
			value={value}
			onChange={setValue}
			data={data}
			placeholder='Tìm chương'
			onItemSubmit={(item) => {
				setValue(item.label)
				Router.push(`/manga/c/${item.value}`)
			}}
			filter={(value, item) =>
				item.label
					.toLocaleLowerCase()
					.includes(value.toLocaleLowerCase().trim())
			}
			nothingFound={
				<Group spacing={4} position='center'>
					<Text color='dimmed' size='lg'>
						Không tìm thấy
					</Text>

					<Player
						autoplay
						loop
						src='/lottie-files/no-data.json'
						style={{
							width: '18px',
							aspectRatio: '1'
						}}
					/>
				</Group>
			}
		/>
	)
}

export default ChapterSelection
