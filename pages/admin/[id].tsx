import { Loader } from '@mantine/core'
import { useReactTable } from '@tanstack/react-table'
import Router, { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import client from 'services/initPocketBase'
import useSWR from 'swr'
import { MangaRaw } from 'types'

type Props = {}

const getChaptersOfManga = async (id: string) => {
	try {
		const resData = await client.records.getOne('mangas', id)
		const data: MangaRaw = JSON.parse(JSON.stringify(resData))

		const filterString = data.chapters.map((c) => `id = '${c}'`).join(' || ')

		try {
			await client.records.getList('chapter', 1, 10, {
				filter: `${filterString}`
			})
		} catch (error) {
			console.log(error)
		}
	} catch (e) {
		console.log(e)
	}
}

const AdminChapterManagement = (props: Props) => {
	const router = useRouter()

	const { data: mangaDetails } = useSWR(router.query.id, getChaptersOfManga, {
		isPaused: () => client.authStore.model == null,
		suspense: true
	})

	return (
		<>
			<Suspense fallback={<Loader />}></Suspense>
		</>
	)
}

export default AdminChapterManagement
