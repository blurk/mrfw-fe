import { Group, Loader } from '@mantine/core';
import React from 'react';

type Props = {
  height?: string;
  loaderSize?: number;
};

const AppLoader = ({ height = '60vh', loaderSize = 40 }: Props) => (
  <Group position="center" sx={{ height }}>
    <Loader size={loaderSize} />
  </Group>
);

export default AppLoader;
