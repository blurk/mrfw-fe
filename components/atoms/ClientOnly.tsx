import React, { ReactNode, useEffect, useRef, useState } from 'react';

type Props = { children: ReactNode | ReactNode[] };

const ClientOnly = ({ children }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;
