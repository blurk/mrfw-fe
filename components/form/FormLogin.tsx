import { Anchor, Box, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import Link from 'next/link';
import { memo } from 'react';
import { LoginRequest } from 'types';
import { Routes } from 'utils/routes';
import { loginSchema } from 'utils/schemas';

interface Props {
  handleSubmit: (data: LoginRequest) => void;
  overlay: JSX.Element;
}

const Form = ({ handleSubmit, overlay }: Props) => {
  const { onSubmit, getInputProps } = useForm<LoginRequest>({
    validate: yupResolver(loginSchema),
    initialValues: loginSchema.cast({}),
  });

  return (
    <Container size={420} my={40} sx={{ position: 'relative' }}>
      {overlay}
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Đăng nhập
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Bạn chưa có tài khoản? Đăng ký ở{' '}
        <Anchor component={Link} href={Routes.SIGN_UP} size="sm">
          đây nè.
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit(handleSubmit)}>
          <TextInput label="Email" placeholder="email@example.com" {...getInputProps('email')} />
          <PasswordInput
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn ở đây nha"
            mt="md"
            {...getInputProps('password')}
          />
          <Box mt="md">
            Bạn quên mật khẩu?{' '}
            <Anchor component={Link} href={Routes.FORGOT_PASSWORD}>
              Vào đây nhé!
            </Anchor>
          </Box>
          <Button fullWidth mt="xl" type="submit">
            Đăng nhập
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export const FormLogin = memo(Form);
