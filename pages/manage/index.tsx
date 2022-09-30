import { Box, Loader, Title } from '@mantine/core'
import MangaManagementLayout from 'components/layout/manage/MangaManagementLayout'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'
import { useSession } from 'utils'

type Props = {}

const AdminIndex = (props: Props) => {
	const { user, isLoading } = useSession()

	useEffect(() => {
		if (!isLoading && !user) {
			Router.push('/login')
		}
	}, [user, isLoading])

	if (isLoading) {
		return (
			<Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
				<Loader />
			</Box>
		)
	}

	if (!user) {
		return null
	}

	return (
		<>
			<Head>
				<title>Quản lý truyện của {user.profile?.name}</title>
			</Head>

			<Title order={1} mt='md' color='gray.8'>
				Quản lý truyện
			</Title>

			<MangaManagementLayout />
		</>
	)
}

export default AdminIndex
