interface Manga {}

interface ChapterExpand {
  belong_to: Manga;
}

export interface Chapter extends PockebaseRecord {
  name: string;
  images: string[];
  belong_to: string;
  expand?: ChapterExpand;
}

export interface ChapterList extends PocketbaseCollection<Chapter> {}

export interface ChapterRequest extends Pick<Chapter, 'name'> {
  images: File[] | string[];
}
