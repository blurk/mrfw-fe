export interface Profile extends PockebaseRecord {
  userId: UniqueId;
  avatar: string;
  name: string;

  bookmark: string[];
  liked: string[];
}

export interface User extends PockebaseRecord {
  email: string;
  verified: boolean;
  lastResetSentAt: DateTimeString;
  lastVerificationSentAt: DateTimeString;
  profile: Profile;
}
