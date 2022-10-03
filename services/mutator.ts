import { Record, User } from "pocketbase";
import client from "./initPocketBase";

export const updateBookmark = (
  mangaId: string,
  isBookmarked = false,
  user: User
) => {
  const profile = user.profile as Record;
  const bookmark = user.profile!.bookmark as string[];

  return client.records.update("profiles", profile.id, {
    bookmark: isBookmarked
      ? bookmark.filter((bm) => bm !== mangaId) // Remove
      : [...bookmark, mangaId],
  });
};
