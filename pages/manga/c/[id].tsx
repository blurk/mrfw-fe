import { GetServerSidePropsContext, NextPage } from 'next'
import React, { useEffect } from 'react'
import client from 'services/initPocketBase'
import { Chapter } from 'types'
import { serverDataTransform } from 'utils'

type Props = {
	chapterDetails: Chapter
}

const Chapter: NextPage<Props> = ({ chapterDetails }) => {
	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await client.records.update(
				'mangas',
				chapterDetails.expand!.belong_to.id,
				{
					views: chapterDetails.expand!.belong_to.views + 1
				}
			)
		}, 7000)

		return () => {
			clearTimeout(timeoutId)
		}
	}, [chapterDetails.id, chapterDetails.expand])

	return <div>[id]</div>
}

export default Chapter

export const getServerSideProps = async ({
	query
}: GetServerSidePropsContext) => {
	const res = await client.records.getOne('chapter', query.id as string, {
		expand: 'belong_to'
	})

	const chapterDetails = serverDataTransform(JSON.parse(JSON.stringify(res)))

	return {
		props: {
			chapterDetails
		}
	}
}
