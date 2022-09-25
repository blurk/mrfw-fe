import { object, string } from 'yup'

export const loginSchema = object().shape({
	email: string()
		.email('Email không hợp lệ')
		.required('Email không được để trống')
		.default(''),
	password: string()
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
		.required('Mật khẩu không được để trống')
		.default('')
})
