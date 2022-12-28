import { ListResult, Record } from 'pocketbase';
import { Author } from './author';
import { Chapter } from './chapter';
import { Comment } from './comment';
import { Genre } from './genre';
import { User } from './user';
import { View } from './views';

export interface Manga extends Record {
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

  expand: {
    view: View;
    upload_by: User;
    author: Author[];
    genres: Genre[];
    chapters: Chapter[];
    comments: Comment[];
  };
}

export interface MangaList extends ListResult<Manga> {}

export interface MangaUploadRequest
  extends Pick<Manga, 'title' | 'description' | 'author' | 'status' | 'genres' | 'upload_by'> {
  cover: File | null | string;
}

export interface SWRMangaUploadFormStatus {
  isDirty: boolean;
  editData: Manga | null;
}
