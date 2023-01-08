import { Button, Group, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import Router from 'next/router';
import client, { logout } from 'services/initPocketBase';
import { ChangePasswordRequest } from 'domains';
import { COLLECTION, updatePassword, useSession } from 'utils';
import FormInputRequestEmail from './FormInputRequestEmail';
import { IconAlertCircle, IconCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { Routes } from 'utils/routes';

type Props = {};

const FormChangePassword = (props: Props) => {
  const { user, setUser } = useSession();

  const [visible, { toggle }] = useDisclosure(false);

  const { onSubmit, getInputProps } = useForm<ChangePasswordRequest>({
    validate: yupResolver(updatePassword),
    initialValues: updatePassword.cast({}),
  });

  const handleSubmit = async (data: ChangePasswordRequest) => {
    try {
      await client.collection(COLLECTION.USERS).confirmPasswordReset(data.token, data.password, data.passwordConfirm);

      showNotification({
        title: 'Thao tác thành công',
        message: 'Thông tin của bạn đã được cập nhật thành công. Bạn sẽ được đưa trở về màn hình đăng nhập',
        color: 'teal',
        icon: <IconCheck size={16} />,
        autoClose: 2000,
        onClose: () => {
          logout();
          setUser(null);
          Router.push(Routes.LOGIN);
        },
      });
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: 'Thông tin của bạn chưa được cập nhật. Hãy thử lại xem nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const sendEmail = async () => {
    if (user) {
      try {
        await client.collection(COLLECTION.USERS).requestPasswordReset(user.email);

        showNotification({
          title: 'Thao tác thành công',
          message: 'Gửi mail thành công! Nhớ kiểm tra cả inbox lẫn spam nhé',
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      } catch (err) {
        showNotification({
          title: 'Thao tác thất bại',
          message: 'Gửi mail thất bại. Hãy thử lại xem nhé',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
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
