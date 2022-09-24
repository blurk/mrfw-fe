import React from 'react'
import {
	Burger,
	Header as MantineHeader,
	MediaQuery,
	Text,
	useMantineTheme
} from '@mantine/core'

type Props = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header = ({ open, setOpen }: Props) => {
	const theme = useMantineTheme()

	return (
		<MantineHeader height={70} p='xs'>
			{/* Header content */}
			<div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
				<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
					<Burger
						opened={open}
						onClick={() => setOpen((o) => !o)}
						size='sm'
						color={theme.colors.gray[6]}
						mr='xl'
					/>
				</MediaQuery>

				<Text>Application header</Text>
			</div>
		</MantineHeader>
	)
}

export default Header
