import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'

require('dayjs/locale/vi')

dayjs.locale('vi')
dayjs.extend(relativeTime)

export const formatDate = (value: string) =>
	dayjs(value).format('HH:MM DD-MM-YYYY')

export const getTodayStartTime = () => dayjs().format('YYYY-MM-DD 00:00:00')
export const getThisWeekStartTime = () =>
	dayjs().subtract(3, 'day').format('YYYY-MM-DD 00:00:00')

export const relativeTimeFromNow = (value: string) => dayjs(value).fromNow()
