import { Admin, BaseAuthStore, User } from 'pocketbase'

class NextAuthStore extends BaseAuthStore {
	private req: any
	private res: any
	constructor(req: any, res: any) {
		super()

		this.req = req
		this.res = res

		this.loadFromCookie(this.req?.headers?.cookie)
	}

	save(token: string, model: User | Admin | null) {
		super.save(token, model)

		this.res?.setHeader('set-cookie', this.exportToCookie())
	}

	clear() {
		super.clear()

		this.res?.setHeader('set-cookie', this.exportToCookie())
	}
}

export default NextAuthStore
