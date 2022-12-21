import { Title } from '@mantine/core';
import AuthWrapper from 'components/atoms/AuthWrapper';
import MangaManagementLayout from 'components/layout/manage/MangaManagementLayout';
import Head from 'next/head';

type Props = {};

const AdminIndex = (props: Props) => {
  return (
    <AuthWrapper>
      {({ user }) => (
        <>
          <Head>
            <title>Quản lý truyện của {user}</title>
          </Head>

          <Title order={1} mt="md" color="gray.8">
            Quản lý truyện
          </Title>

          <MangaManagementLayout />
        </>
      )}
    </AuthWrapper>
  );
};

export default AdminIndex;
