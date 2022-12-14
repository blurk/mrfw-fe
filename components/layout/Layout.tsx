import { AppShell, Container, useMantineTheme } from '@mantine/core'
import Footer from './Footer'
import Header from './Header'

type Props = {
	children?: JSX.Element | JSX.Element[]
}

const Layout = ({ children }: Props) => {
	const theme = useMantineTheme()

	return (
		<>
			<AppShell
				styles={{
					main: {
						background: theme.colors.gray[1]
					}
				}}
				navbarOffsetBreakpoint='sm'
				asideOffsetBreakpoint='sm'
				header={<Header />}>
				<Container mb='30vh'>{children}</Container>
			</AppShell>
			<Footer />
		</>
	)
}

export default Layout
