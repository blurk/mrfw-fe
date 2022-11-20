import { Genre, View } from 'types';
import { Author } from './author';
import { Chapter } from './chapter';
import { Profile } from './user';

export interface MangaExpand {
  upload_by: Profile;
  view: View;

  genres: Genre[];
  author: Author[];
  chapters: Chapter[];
  comments: Comment[];
}

export interface Manga extends PockebaseRecord {
  title: string;
  description: string;
  upload_by: string;
  view: string;

  genres: string[];
  status: string;
  cover: string;
  author: string[];
  chapters: string[];
  comments: string[];

  '@expand': MangaExpand;
}

export interface MangaList extends PocketbaseCollection<Manga> {}

export interface MangaUploadRequest
  extends Pick<Manga, 'title' | 'description' | 'author' | 'status' | 'genres' | 'upload_by'> {
  cover: File | null | string;
}

export interface SWRMangaUploadFormStatus {
  isDirty: boolean;
  editData: Manga | null;
}
