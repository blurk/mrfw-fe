import { z } from 'zod';

const loginSchema = z.object({
  email: z.string({ required_error: 'Email không được để trống' }).email('Email không hợp lệ').default(''),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống' })
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
    .default(''),
});

type LoginSchema = z.infer<typeof loginSchema>;
