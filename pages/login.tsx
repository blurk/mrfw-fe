import { FormLogin } from 'components/form/FormLogin'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { User } from 'pocketbase'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import client from 'services/initPocketBase'
import { LoginRequest } from 'types'
import { useSession } from 'utils/useSession'

type Props = {
	prevRoute: string
}

const Login: NextPage<Props> = ({ prevRoute }) => {
	const { setUser } = useSession()

	const handleSubmit = useCallback(
		async (data: LoginRequest) => {
			await toast.promise(
				client.users.authViaEmail(data.email, data.password),
				{
					loading: 'Đang đăng nhập...',
					success: 'Đăng nhập thành công ^^',
					error: 'Đăng nhập thất bại :('
				}
			)
			const user = client.authStore.model

			setUser(user as User)
			Router.back()
		},
		[setUser]
	)

	return (
		<>
			<Head>
				<title>Đăng nhập</title>
			</Head>

			<FormLogin handleSubmit={handleSubmit} />
		</>
	)
}

export default Login

export async function getServerSideProps({
	req,
	res
}: GetServerSidePropsContext) {
	const prevRoute = req.headers?.referer
		? req.headers?.referer.split('/').slice(3).join('/')
		: ''

	return {
		props: {
			prevRoute
		}
	}
}
