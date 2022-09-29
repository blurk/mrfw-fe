import { BasePocketbaseCollection, BasePocketbaseRecord } from "./base";

export interface Chapter extends BasePocketbaseRecord {
  name: string;
  images: string[];
}

export interface ChapterList extends BasePocketbaseCollection<Chapter> {}
