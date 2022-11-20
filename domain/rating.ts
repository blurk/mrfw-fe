export interface Rating extends PockebaseRecord {
  like: boolean;
  by: string;
  on_manga: string;
}
