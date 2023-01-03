import { Button, Group, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useDisclosure, useTimeout } from '@mantine/hooks';
import Router from 'next/router';
import toast from 'react-hot-toast';
import client, { logout } from 'services/initPocketBase';
import { ChangePasswordRequest } from 'domains';
import { COLLECTION, updatePassword, useSession } from 'utils';
import FormInputRequestEmail from './FormInputRequestEmail';

type Props = {};

const FormChangePassword = (props: Props) => {
  const { user, setUser } = useSession();

  const [visible, { toggle }] = useDisclosure(false);
  const { start } = useTimeout(() => Router.push('/login'), 1000);

  const { onSubmit, getInputProps } = useForm<ChangePasswordRequest>({
    validate: yupResolver(updatePassword),
    initialValues: updatePassword.cast({}),
  });

  const handleSubmit = async (data: ChangePasswordRequest) => {
    try {
      await client.collection(COLLECTION.USERS).confirmPasswordReset(data.token, data.password, data.passwordConfirm);

      toast.success('Cập nhật thành công');
      logout();
      setUser(null);
      toast('Vui lòng đăng nhập lại');

      start();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const sendEmail = async () => {
    if (user) {
      try {
        await client.collection(COLLECTION.USERS).requestPasswordReset(user.email);

        toast.success('Gửi mail thành công! Nhớ kiểm tra cả inbox lẫn spam nhé');
      } catch (err) {
        toast.error('Gửi mail thất bại');
      }
    }
  };

  return (
    <Paper p="md" mt="md">
      <Group position="apart">
        <Title order={2}>Đổi mật khẩu</Title>

        {user?.email ? (
          <Button variant="outline" disabled={!user?.email} onClick={sendEmail}>
            Gửi email xác nhận tới: {user?.email ?? ''}
          </Button>
        ) : (
          <FormInputRequestEmail />
        )}
      </Group>
      <form onSubmit={onSubmit(handleSubmit)} style={{ position: 'relative' }}>
        <TextInput label="Mã" placeholder="Mã xác nhận đổi mật khẩu ở đây" mt="md" {...getInputProps('token')} />
        <PasswordInput
          label="Mật khẩu"
          placeholder="Mật khẩu của bạn ở đây"
          mt="md"
          {...getInputProps('password')}
          onVisibilityChange={toggle}
        />
        <PasswordInput
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu của bạn ở đây nha"
          mt="md"
          visible={visible}
          {...getInputProps('passwordConfirm')}
          onVisibilityChange={toggle}
        />
        <Button fullWidth mt="xl" type="submit">
          Cập nhật mật khẩu
        </Button>
      </form>
    </Paper>
  );
};

export default FormChangePassword;
