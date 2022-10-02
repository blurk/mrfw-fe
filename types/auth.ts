import { User } from 'pocketbase'
import { Profile } from './profile'

export interface LoginRequest {
	email: string
	password: string
}

export interface LoginResponse {
	token: string
	user: User
}

export interface SignUpRequest {
	email: string
	password: string
	passwordConfirm: string
}

export interface ChangePasswordRequest {
	token: string
	password: string
	passwordConfirm: string
}

export interface SignUpResponse {
	id: string
	created: string
	updated: string
	email: string
	verified: boolean
	lastResetSentAt: string
	lastVerificationSentAt: string
	profile: Profile
}
