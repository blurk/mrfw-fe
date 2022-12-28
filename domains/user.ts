import { Record } from 'pocketbase';

export interface User extends Record {
  username: string;
  verified: boolean;
  emailVisibility: boolean;
  email: Email;
  name: string;
  avatar: string;

  bookmark: string[];
  liked: string[];
}
