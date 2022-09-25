import { Badge } from '@mantine/core'
import React from 'react'
import { MangaStatusColor, MangaStatusText } from 'utils'

type Props = {
	type: keyof typeof MangaStatusColor
}

const MangaStatusBadge = ({ type }: Props) => (
	<Badge variant='filled' color={MangaStatusColor[type]}>
		{MangaStatusText[type]}
	</Badge>
)

export default MangaStatusBadge
