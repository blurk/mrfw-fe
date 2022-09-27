import { User } from 'pocketbase'
import client, { getCurrentUser } from 'services/initPocketBase'
import useSWR from 'swr'

export function useSession() {
	const { data, mutate, error } = useSWR(
		'api_user',
		client.authStore.model ? getCurrentUser : () => null
	)

	return {
		user: data ?? null,
		isLoading: data === undefined && error === undefined,
		setUser: (value: User | null) => {
			mutate(value, {
				revalidate: false
			})
		}
	}
}
