import { Button, Group, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons';
import React, { useState } from 'react';
import client from 'services/initPocketBase';
import { COLLECTION } from 'utils';

type Props = {};

const FormInputRequestEmail = (props: Props) => {
  const [email, setEmail] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await client.collection(COLLECTION.USERS).requestPasswordReset(email);

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
  };

  return (
    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
      <Group position="right">
        <TextInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          label="Email"
          placeholder="Nhập email của bạn để lấy mã xác nhận"
          withAsterisk
          required
        />
        <Button mt="lg" type="submit">
          Gửi email xác nhận
        </Button>
      </Group>
    </form>
  );
};

export default FormInputRequestEmail;
