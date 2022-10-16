import { User } from 'pocketbase';
import client, { getCurrentUser } from 'services/initPocketBase';
import useSWR from 'swr';

export function useSession() {
  const { data, mutate, error } = useSWR(client.authStore.model ? 'api_user' : null, getCurrentUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 1,
  });

  return {
    user: data ?? null,
    isLoading: data === undefined && error === undefined,
    setUser: (value: User | null) => {
      mutate(value, {
        revalidate: false,
      });
    },
  };
}
