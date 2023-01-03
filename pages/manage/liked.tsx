import AuthWrapper from 'components/atoms/AuthWrapper';
import ClientOnly from 'components/atoms/ClientOnly';
import WithSuspense from 'components/atoms/WithSuspense';
import LikedManga from 'components/layout/manage/LikedManga';
import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'utils';

type Props = {};

const LikedMangaPage: NextPage<Props> = () => {
  const { user } = useSession();

  return (
    <ClientOnly>
      <AuthWrapper>
        <WithSuspense>
          <Head>
            <title>Danh sách truyện đã thích</title>
          </Head>
          <LikedManga user={user} />
        </WithSuspense>
      </AuthWrapper>
    </ClientOnly>
  );
};

export default LikedMangaPage;
