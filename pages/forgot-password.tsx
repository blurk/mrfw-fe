import FormChangePassword from 'components/form/FormChangePassword'
import Head from 'next/head'

type Props = {}

const ForgotPassword = (props: Props) => {
	return (
		<>
			<Head>
				<title>Reset mật khẩu</title>
			</Head>

			<FormChangePassword />
		</>
	)
}

export default ForgotPassword
