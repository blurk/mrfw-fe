import AuthWrapper from 'components/atoms/AuthWrapper';
import ClientOnly from 'components/atoms/ClientOnly';
import ChapterManagementLayout from 'components/layout/manage/ChapterManagementLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PageMid = () => {
  const router = useRouter();

  return (
    <ClientOnly>
      <AuthWrapper>
        <Head>
          <title>Quản lý chương</title>
        </Head>
        <ChapterManagementLayout mid={(router.query?.mid as string) ?? ''} />
      </AuthWrapper>
    </ClientOnly>
  );
};

export default PageMid;
