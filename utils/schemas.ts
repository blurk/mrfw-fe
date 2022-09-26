import { array, mixed, object, string } from 'yup'

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

export const uploadMangaSchema = object().shape({
	title: string().required('Tên tryện không được để trống').default(''),
	description: string().default(''),
	cover: mixed().required('Bìa truyện không được để trống').default(null),

	genres: array(string().default(''))
		.required('Thể loại không được để trống')
		.min(1)
		.default([]),
	author: array(string().default(''))
		.required('Tác giả không được để trống')
		.min(1)
		.default([]),

	status: string()
		.required('Trạng thái không được để trống')
		.default('ONGOING')
		.oneOf(['ONGOING', 'COMPLETED', 'CANCELLED', 'PAUSED'])
})
