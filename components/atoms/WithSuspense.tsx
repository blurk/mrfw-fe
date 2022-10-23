import React, { Suspense } from 'react';
import AppLoader from './AppLoader';
import ErrorBoundary from './ErrorBoundary';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const WithSuspense = ({ children }: Props) => (
  <ErrorBoundary>
    <Suspense fallback={<AppLoader />}>{children}</Suspense>
  </ErrorBoundary>
);

export default WithSuspense;
