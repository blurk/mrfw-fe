import { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignUpRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ChangePasswordRequest {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface SignUpResponse extends User {}
