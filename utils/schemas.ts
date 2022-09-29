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
	description: string()
		.default('')
		.required('Tóm tắt truyện không được để trống'),
	cover: mixed().required('Bìa truyện không được để trống').default(null),

	genres: array(string().default(''))
		.required('Thể loại không được để trống')
		.min(1, 'Chọn ít nhất 1 thể loại')
		.default([]),
	author: array(string().default(''))
		.required('Tác giả không được để trống')
		.min(1, 'Chọn ít nhất 1 tác giả')
		.default([]),

	status: string()
		.required('Trạng thái không được để trống')
		.default('ONGOING')
		.oneOf(['ONGOING', 'COMPLETED', 'CANCELLED', 'PAUSED'])
})

export const chapterSchema = object().shape({
	name: string().required('Tên chương không được để trống').default(''),
	images: array()
		.of(mixed().default(null))
		.min(1, 'Chương phải có ít nhất 1 ảnh')
		.required('Ảnh của chương không được để trống')
		.default([])
})
