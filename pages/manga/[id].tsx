import { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'

type Props = {
	id: string
}

const PageMangaSingle: NextPage<Props> = ({ id }) => {
	return <div>{id}</div>
}

export default PageMangaSingle

export const getServerSideProps = async ({
	query
}: GetServerSidePropsContext) => {
	return {
		props: {
			id: query.id
		}
	}
}
