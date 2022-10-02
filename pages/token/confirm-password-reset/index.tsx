import { Player } from '@lottiefiles/react-lottie-player'
import { Button, CopyButton, Paper, Stack, Title } from '@mantine/core'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

type Props = {}

const PageConfirmEmailSend: NextPage<Props> = (props) => {
	const router = useRouter()

	const hash = router.asPath.split('#')[1]

	return (
		<>
			<Head>
				<title>Lấy mã xác nhận</title>
			</Head>

			<Paper p='xl'>
				<Stack align='center'>
					<Title order={1} color='dimmed' align='center'>
						Lấy mã xác nhận
					</Title>
					<Player
						autoplay
						loop
						src='/lottie-files/copy-token.json'
						style={{
							height: '300px',
							aspectRatio: '1'
						}}
					/>
					<CopyButton value={hash}>
						{({ copied, copy }) => (
							<Button color={copied ? 'teal' : 'pink'} onClick={copy}>
								{copied ? 'Đã copy mã xác nhận' : 'Copy mã xác nhận'}
							</Button>
						)}
					</CopyButton>
				</Stack>
			</Paper>
		</>
	)
}

export default PageConfirmEmailSend
