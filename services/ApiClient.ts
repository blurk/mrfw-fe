import pocketbaseEs from 'pocketbase'

const client = new pocketbaseEs(process.env.NEXT_PUBLIC_SERVER_URL)

export default client
