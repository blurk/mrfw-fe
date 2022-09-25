import { Box, Container, Group, Header as MantineHeader } from '@mantine/core'
import Logo from 'components/atoms/Logo'
import MenuProfile from 'components/atoms/MenuProfile'
import SearchBox from 'components/atoms/SearchBox'

type Props = {}

const Header = ({}: Props) => {
	return (
		<MantineHeader height={70} p='lg'>
			<Container>
				<Group position='apart'>
					<Logo />
					<Box sx={{ flex: 1 }}>
						<SearchBox />
					</Box>
					<MenuProfile />
				</Group>
			</Container>
		</MantineHeader>
	)
}

export default Header
