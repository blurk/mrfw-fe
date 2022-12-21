import PocketBase from 'pocketbase';

const client = new PocketBase(process.env.NEXT_PUBLIC_SERVER_URL);

export const logout = () => client.authStore.clear();

export const getCurrentUser = async () => {
  // client.authStore.model ? client.users.getOne(client.authStore.model.id) : null;
  return null;
};

export default client;
