import { Record } from 'pocketbase';

type DateTimeString = string;
type Email = string;
type UniqueId = string;
interface PocketBaseRecord extends Record {}

interface PocketbaseCollection<T extends object> {
  page: number;
  perPage: number;
  totalItems: number;
  items: T[];
}
