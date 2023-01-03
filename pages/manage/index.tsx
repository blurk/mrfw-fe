import { Title } from '@mantine/core';
import AuthWrapper from 'components/atoms/AuthWrapper';
import ClientOnly from 'components/atoms/ClientOnly';
import MangaManagementLayout from 'components/layout/manage/MangaManagementLayout';
import Head from 'next/head';
import { useSession } from 'utils';

type Props = {};

const AdminIndex = (props: Props) => {
  const { user } = useSession();

  return (
    <ClientOnly>
      <AuthWrapper>
        <Head>
          <title>Quản lý truyện của {user?.name}</title>
        </Head>

        <Title order={1} mt="md" color="gray.8">
          Quản lý truyện
        </Title>

        <MangaManagementLayout />
      </AuthWrapper>
    </ClientOnly>
  );
};

export default AdminIndex;
