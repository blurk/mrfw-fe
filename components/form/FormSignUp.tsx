import { Anchor, Box, Button, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import Link from 'next/link';
import { useForm, yupResolver } from '@mantine/form';
import { SignUpRequest } from 'domains';
import { signUpSchema } from 'utils/schemas';
import { memo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Routes } from 'utils/routes';

interface Props {
  handleSubmit: (data: SignUpRequest) => void;
  overlay: JSX.Element;
}

const Form = ({ handleSubmit, overlay }: Props) => {
  const { onSubmit, getInputProps } = useForm<SignUpRequest>({
    validate: yupResolver(signUpSchema),
    initialValues: signUpSchema.cast({}),
  });

  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Container size={420} my={40} sx={{ position: 'relative' }}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Đăng ký
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Bạn đã có tài khoản? Đăng nhập ở{' '}
        <Anchor component={Link} href={Routes.LOGIN} size="sm">
          đây nè.
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit(handleSubmit)}>
          <TextInput label="Email" placeholder="email@example.com" {...getInputProps('email')} />
          <PasswordInput
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn ở đây"
            mt="md"
            {...getInputProps('password')}
            visible={visible}
            onVisibilityChange={toggle}
          />
          <PasswordInput
            label="Nhập lại mật khẩu"
            placeholder="Nhập lại mật khẩu của bạn ở đây nha"
            mt="md"
            {...getInputProps('passwordConfirm')}
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Button fullWidth mt="xl" type="submit">
            Đăng ký
          </Button>
        </form>
      </Paper>
      {overlay}
    </Container>
  );
};

export default memo(Form);
