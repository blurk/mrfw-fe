import { Box, LoadingOverlay } from '@mantine/core';
import FormSignUp from 'components/form/FormSignUp';
import Head from 'next/head';
import Router from 'next/router';
import React, { useCallback, useState } from 'react';
import client from 'services/initPocketBase';
import { SignUpRequest } from 'domains';
import { COLLECTION } from 'utils';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons';

type Props = {};

const SignUp = (props: Props) => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = useCallback(async (data: SignUpRequest) => {
    setVisible(true);

    try {
      await client.collection(COLLECTION.USERS).create({ ...data });

      showNotification({
        title: 'Đăng ký thành công ^^',
        message: 'Bạn sẽ được đưa về trang đăng nhập',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });

      Router.push('/login');
    } catch (error) {
      showNotification({
        title: 'Đăng nhập thất bại :(',
        message: 'Hãy thử lại xem nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      console.log(error);
    } finally {
      setVisible(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Đăng nhập</title>
      </Head>

      <Box sx={{ position: 'relative' }}>
        <FormSignUp handleSubmit={handleSubmit} overlay={<LoadingOverlay visible={visible} overlayBlur={2} />} />
      </Box>
    </>
  );
};

export default SignUp;
