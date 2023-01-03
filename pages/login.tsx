import { LoadingOverlay } from '@mantine/core';
import { FormLogin } from 'components/form/FormLogin';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import client from 'services/initPocketBase';
import { LoginRequest, User } from 'domains';
import { useSession } from 'utils';

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

        toast.success('Đăng nhập thành công ^^');
        Router.push('/');
      } catch (error) {
        toast.error('Đăng nhập thất bại :(');
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
