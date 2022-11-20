type DateTimeString = string;
type Email = string;
type UniqueId = string;

interface PockebaseRecord {
  '@collectionId': string;
  '@collectionName': string;
  '@expand': Record<string, any>;
  id: UniqueId;
  created: DateTimeString;
  updated: DateTimeString;
}

interface PocketbaseCollection<T extends object> {
  page: number;
  perPage: number;
  totalItems: number;
  items: T[];
}
