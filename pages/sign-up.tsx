import { Box, LoadingOverlay } from '@mantine/core';
import FormSignUp from 'components/form/FormSignUp';
import Head from 'next/head';
import Router from 'next/router';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import client from 'services/initPocketBase';
import { SignUpRequest } from 'domains';
import { COLLECTION } from 'utils';

type Props = {};

const SignUp = (props: Props) => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = useCallback(async (data: SignUpRequest) => {
    setVisible(true);

    try {
      await client.collection(COLLECTION.USERS).create({ ...data });

      toast.success('Đăng ký thành công ^^');

      Router.push('/login');
    } catch (error) {
      toast.error('Đăng ký thất bại');
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
