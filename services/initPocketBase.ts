import PocketBase from 'pocketbase';

const client = new PocketBase(process.env.NEXT_PUBLIC_SERVER_URL);

export const logout = () => client.authStore.clear();

export default client;
