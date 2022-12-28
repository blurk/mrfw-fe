import { Button, Group, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import client from 'services/initPocketBase';
import { COLLECTION } from 'utils';

type Props = {};

const FormInputRequestEmail = (props: Props) => {
  const [email, setEmail] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await client.collection(COLLECTION.USERS).requestPasswordReset(email);

      toast.success('Gửi mail thành công! Nhớ kiểm tra cả inbox lẫn spam nhé');
    } catch (err) {
      toast.error('Gửi mail thất bại');
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
