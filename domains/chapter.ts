import { ListResult, Record } from 'pocketbase';
import { Manga } from './manga';

export interface Chapter extends Record {
  name: string;
  images: string[];
  belong_to: string;

  expand: {
    belong_to: Manga;
  };
}

export interface ChapterList extends ListResult<Chapter> {}

export interface ChapterRequest extends Pick<Chapter, 'name'> {
  images: File[] | string[];
}
