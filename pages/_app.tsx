import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { Layout } from '../components'
import { SWRConfig } from 'swr'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Page title</title>
				<link rel='shortcut icon' href='/favicon.svg' />
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
			</Head>

			<SWRConfig>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={
						{
							/** Put your mantine theme override here */
						}
					}>
					<Toaster />
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</MantineProvider>
			</SWRConfig>
		</>
	)
}

export default MyApp
