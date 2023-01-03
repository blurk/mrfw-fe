import { Author, Genre } from 'domains';

export const getImageUrl = (collectionId: string, recordId: string, url: string, thumb?: string) =>
  `${process.env.NEXT_PUBLIC_FILES_URL}/${collectionId}/${recordId}/${url}${thumb ? '?thumb=' + thumb : ''}`;

export const getKey = (pageIndex: number, perPage: number) => ['chapters-table', pageIndex, perPage];

export const getAuthorsName = (authors: Author[]) => authors.map((author) => author.name).join(', ');

export const getGenresName = (genres: Genre[]) => genres.map((genres) => genres.name);
