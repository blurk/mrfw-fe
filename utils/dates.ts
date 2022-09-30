import dayjs from 'dayjs'

require('dayjs/locale/vi')

dayjs.locale('vi')

export const formatDate = (value: string) =>
	dayjs(value).format('HH:MM DD-MM-YYYY')

export const getTodyStartTime = () => dayjs().format('YYYY-MM-DD 00:00:00')
export const getThisWeekStartTime = () =>
	dayjs().subtract(3, 'day').format('YYYY-MM-DD 00:00:00')
