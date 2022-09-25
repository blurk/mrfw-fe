import dayjs from 'dayjs'

require('dayjs/locale/vi')

dayjs.locale('vi')

export const formatDate = (value: string) =>
	dayjs(value).format('HH:MM DD-MM-YYYY')
