import { Box, Button, FileInput, Grid, Loader, Paper, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import AuthWrapper from 'components/atoms/AuthWrapper';
import ClientOnly from 'components/atoms/ClientOnly';
import FormChangePassword from 'components/form/FormChangePassword';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/legacy/image';
import Router from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import client from 'services/initPocketBase';
import { useSWRConfig } from 'swr';
import { COLLECTION, getImageUrl, transformToFormData, useSession } from 'utils';

type Props = {};

const ProfilePage: NextPage<Props> = ({}) => {
  const { user } = useSession();

  const { mutate } = useSWRConfig();

  const { onSubmit, getInputProps, isDirty } = useForm();

  const handleSubmit = async (data: { name?: string; avatar?: File | null }) => {
    if (user) {
      try {
        await client.collection('users').update(user.id, transformToFormData({ ...data }));
        // manually revalidate
        mutate('api_user');
        toast.success('Cập nhật thành công');
      } catch (error) {
        toast.error('Cập nhật thất bại');
      }
    }
  };

  return (
    <ClientOnly>
      <AuthWrapper>
        <Head>
          <title>Quản lý thông tin tài khoản</title>
        </Head>

        <Title>Thông tin cá nhân</Title>

        <Grid>
          <Grid.Col span={6}>
            <Paper p="md" mt="md">
              <form onSubmit={onSubmit(handleSubmit)}>
                <TextInput
                  label="Tên người dùng"
                  placeholder="người dùng"
                  defaultValue={user?.name}
                  {...getInputProps('name')}
                  required
                />

                <FileInput
                  required
                  label="Avatar"
                  mt="sm"
                  placeholder="Chọn một ảnh bất kỳ"
                  defaultValue={getImageUrl(COLLECTION.USERS, user?.id, user?.avatar)}
                  valueComponent={AvatarPreview}
                  {...getInputProps('avatar')}
                />

                <TextInput mt="sm" label="Email đăng ký" defaultValue={user?.email} disabled />
                <Button fullWidth mt="xl" type="submit" disabled={!isDirty()}>
                  Cập nhật thông tin
                </Button>
              </form>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <FormChangePassword />
          </Grid.Col>
        </Grid>
      </AuthWrapper>
    </ClientOnly>
  );
};

export default ProfilePage;

function AvatarPreview({ value }: { value: File }) {
  if (!value) {
    return null;
  }

  const imageUrl = typeof value !== 'string' ? URL.createObjectURL(value) : value;

  return <Image src={imageUrl} alt="avatar" width={150} height={150} />;
}
