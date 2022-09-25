import {
	Anchor,
	Box,
	Button,
	Container,
	Group,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title
} from '@mantine/core'
import Link from 'next/link'
import { useForm, yupResolver } from '@mantine/form'
import { LoginRequest } from 'types'
import { loginSchema } from 'utils/schemas'
import { memo } from 'react'

interface Props {
	handleSubmit: (data: LoginRequest) => void
}

const Form = ({ handleSubmit }: Props) => {
	const { onSubmit, getInputProps } = useForm<LoginRequest>({
		validate: yupResolver(loginSchema),
		initialValues: loginSchema.cast({})
	})

	return (
		<Container size={420} my={40}>
			<Title
				align='center'
				sx={(theme) => ({
					fontFamily: `Greycliff CF, ${theme.fontFamily}`,
					fontWeight: 900
				})}>
				Đăng nhập
			</Title>
			<Text color='dimmed' size='sm' align='center' mt={5}>
				Bạn chưa có tài khoản? Đăng ký ở{' '}
				<Link href='/sign-up' passHref>
					<Anchor<'a'> size='sm'>đây nè.</Anchor>
				</Link>
			</Text>

			<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
				<form onSubmit={onSubmit(handleSubmit)}>
					<TextInput
						label='Email'
						placeholder='email@example.com'
						{...getInputProps('email')}
					/>
					<PasswordInput
						label='Mật khẩu'
						placeholder='Mật khẩu của bạn ở đây nha'
						mt='md'
						{...getInputProps('password')}
					/>
					<Box mt='md'>
						Bạn quên mật khẩu?{' '}
						<Link href='/forgot-password'>
							<Anchor<'a'>>Vào đây nhé!</Anchor>
						</Link>
					</Box>
					<Button fullWidth mt='xl' type='submit'>
						Đăng nhập
					</Button>
				</form>
			</Paper>
		</Container>
	)
}

export const FormLogin = memo(Form)
