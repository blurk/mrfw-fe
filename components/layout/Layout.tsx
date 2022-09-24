import { AppShell, Navbar, Text, useMantineTheme } from '@mantine/core'
import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'

type Props = {
	children?: JSX.Element | JSX.Element[]
}

const Layout = ({ children }: Props) => {
	const theme = useMantineTheme()
	const [opened, setOpened] = useState(false)

	return (
		<AppShell
			styles={{
				main: {
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[0]
				}
			}}
			navbarOffsetBreakpoint='sm'
			asideOffsetBreakpoint='sm'
			navbar={
				<Navbar
					p='md'
					hiddenBreakpoint='sm'
					hidden={!opened}
					width={{ sm: 200, lg: 300 }}>
					<Text>Application navbar</Text>
				</Navbar>
			}
			footer={<Footer />}
			header={<Header open={opened} setOpen={setOpened} />}>
			{children}
		</AppShell>
	)
}

export default Layout
