import {
	Box,
	Button,
	FileInput,
	Grid,
	Group,
	Loader,
	Paper,
	PasswordInput,
	TextInput,
	Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import FormChangePassword from 'components/form/FormChangePassword'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import { Record } from 'pocketbase'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import client from 'services/initPocketBase'
import { useSWRConfig } from 'swr'
import { getImageUrl, transformToFormData, useSession } from 'utils'

type Props = {}

const ProfilePage: NextPage<Props> = ({}) => {
	const { user, isLoading } = useSession()

	const { mutate } = useSWRConfig()

	useEffect(() => {
		if (!isLoading && !user) {
			Router.push('/login')
		}
	}, [user, isLoading])

	const { onSubmit, getInputProps, isDirty } = useForm()

	const handleSubmit = async (data: {
		name?: string
		avatar?: File | null
	}) => {
		if (user?.profile) {
			try {
				await client.records.update(
					'profiles',
					user.profile.id,
					transformToFormData({ ...data })
				)
				// manually revalidate
				mutate('api_user')
				toast.success('Cập nhật thành công')
			} catch (error) {
				toast.error('Cập nhật thất bại')
			}
		}
	}

	if (isLoading) {
		return (
			<Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
				<Loader />
			</Box>
		)
	}

	if (!user || !user.profile) {
		return null
	}

	return (
		<>
			<Head>
				<title>Quản lý thông tin tài khoản</title>
			</Head>

			<Title>Thông tin cá nhân</Title>

			<Grid>
				<Grid.Col span={6}>
					<Paper p='md' mt='md'>
						<form onSubmit={onSubmit(handleSubmit)}>
							<TextInput
								label='Tên người dùng'
								placeholder='người dùng'
								defaultValue={user.profile.name}
								{...getInputProps('name')}
								required
							/>

							<FileInput
								required
								label='Avatar'
								mt='sm'
								placeholder='Chọn một ảnh bất kỳ'
								defaultValue={getImageUrl(
									'profiles',
									user.profile.id,
									user.profile.avatar
								)}
								valueComponent={AvatarPreview}
								{...getInputProps('avatar')}
							/>

							<TextInput
								mt='sm'
								label='Email đăng ký'
								defaultValue={user.email}
								disabled
							/>
							<Button fullWidth mt='xl' type='submit' disabled={!isDirty()}>
								Cập nhật thông tin
							</Button>
						</form>
					</Paper>
				</Grid.Col>

				<Grid.Col span={6}>
					<FormChangePassword />
				</Grid.Col>
			</Grid>
		</>
	)
}

export default ProfilePage

function AvatarPreview({ value }: { value: File }) {
	if (!value) {
		return null
	}

	const imageUrl =
		typeof value !== 'string' ? URL.createObjectURL(value) : value

	return <Image src={imageUrl} alt='avatar' width={150} height={150} />
}
