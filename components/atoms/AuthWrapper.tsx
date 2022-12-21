import Router from 'next/router';
import React, { ReactNode } from 'react';

import { Routes } from 'utils/routes';
import { useSession } from 'utils';
import AppLoader from './AppLoader';

type Props = {
  children: ({ user }: { user: null }) => ReactNode | ReactNode[];
};

const AuthWrapper = ({ children }: Props) => {
  const { isLoading, user } = useSession();

  if (isLoading) {
    return <AppLoader />;
  }

  if (!user && !isLoading) {
    Router.push(Routes.LOGIN);
    return null;
  }

  return <>{children({ user })}</>;
};

export default AuthWrapper;
