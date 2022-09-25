import { Group, Text, UnstyledButton } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

type Props = {}

const Logo = (props: Props) => {
	return (
		<Link href='/' passHref>
			<UnstyledButton>
				<Group spacing={8}>
					<Image
						src='/logo.gif'
						width={28}
						height={28}
						alt='Smiling face logo'
					/>
					<Text variant='gradient' component='span' weight={500}>
						MRWF
					</Text>
				</Group>
			</UnstyledButton>
		</Link>
	)
}

export default Logo
