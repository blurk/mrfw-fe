import { User } from 'domains/user';
import client from 'services/initPocketBase';
import useSWR from 'swr';

export function useSession() {
  const { data, mutate, error, isLoading } = useSWR(
    client.authStore.model ? 'api_user' : null,
    () => client.authStore.model,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1,
    }
  );

  return {
    user: (data ?? null) as User,
    isLoading,
    setUser: (value: User | null) => {
      mutate(value, {
        revalidate: false,
      });
    },
  };
}
