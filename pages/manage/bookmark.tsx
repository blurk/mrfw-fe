import AuthWrapper from 'components/atoms/AuthWrapper';
import ClientOnly from 'components/atoms/ClientOnly';
import WithSuspense from 'components/atoms/WithSuspense';
import BookmarkManga from 'components/layout/manage/BookmarkManga';
import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'utils';

type Props = {};

const BookmarkPage: NextPage<Props> = () => {
  const { user } = useSession();

  return (
    <ClientOnly>
      <AuthWrapper>
        <WithSuspense>
          <Head>
            <title>Danh sách truyện theo dõi</title>
          </Head>
          <BookmarkManga user={user} />
        </WithSuspense>
      </AuthWrapper>
    </ClientOnly>
  );
};

export default BookmarkPage;
