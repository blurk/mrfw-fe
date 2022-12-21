import { Dialog, Group, Button, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { Routes } from 'utils/routes';

type Props = {
  opened: boolean;
  close: () => void;
};

const NeedLoginDialog = ({ opened, close }: Props) => {
  return (
    <Dialog opened={opened} withCloseButton onClose={close} sx={{ width: 370 }} radius="md">
      <Text size="sm" weight={500} mb={10}>
        Hãy{' '}
        <Anchor component={Link} href={Routes.LOGIN}>
          đăng nhập
        </Anchor>
        để thực hiện chức năng này nhé
      </Text>
    </Dialog>
  );
};

export default NeedLoginDialog;
