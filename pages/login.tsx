import { LoadingOverlay } from '@mantine/core';
import { FormLogin } from 'components/form/FormLogin';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useCallback, useState } from 'react';
import client from 'services/initPocketBase';
import { LoginRequest, User } from 'domains';
import { useSession } from 'utils';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons';

type Props = {};

const Login: NextPage<Props> = ({}) => {
  const { setUser } = useSession();
  const [visible, setVisible] = useState(false);

  const handleSubmit = useCallback(
    async (data: LoginRequest) => {
      setVisible(true);
      try {
        await client.collection('users').authWithPassword(data.email, data.password);

        const user = client.authStore.model;

        setUser(user as User);

        showNotification({
          title: 'Đăng nhập thành công ^^',
          message: 'Bạn sẽ được đưa về trang chủ',
          color: 'teal',
          icon: <IconCheck size={16} />,
        });

        Router.push('/');
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
    },
    [setUser]
  );

  return (
    <>
      <Head>
        <title>Đăng nhập</title>
      </Head>

      <FormLogin handleSubmit={handleSubmit} overlay={<LoadingOverlay visible={visible} overlayBlur={2} />} />
    </>
  );
};

export default Login;
