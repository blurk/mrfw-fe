import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { Layout } from '../components'
import { NextIntlProvider } from 'next-intl'

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

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={
					{
						/** Put your mantine theme override here */
					}
				}>
				<Layout>
					<NextIntlProvider messages={pageProps.messages}>
						<Component {...pageProps} />
					</NextIntlProvider>
				</Layout>
			</MantineProvider>
		</>
	)
}

export default MyApp
