import { Button, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeart, IconBookmark } from "@tabler/icons";
import React from "react";
import toast from "react-hot-toast";
import client from "services/initPocketBase";
import { updateBookmark } from "services/mutator";
import { useSWRConfig } from "swr";
import { Profile } from "types";
import { useSession } from "utils";
import NeedLoginDialog from "./NeedLoginDialog";

type Props = {
  mangaId: string;
};

const MangaInfoCardFooterActions = ({ mangaId }: Props) => {
  const { user } = useSession();
  const { mutate } = useSWRConfig();

  const isBookmarked = user?.profile?.bookmark?.includes(mangaId);
  const isLiked = false;
  const theme = useMantineTheme();

  const [opened, { close, open }] = useDisclosure(false);

  const withNotLogin = (fn: () => void) => () => {
    if (user) {
      fn();
    } else {
      open();
    }
  };

  const onLike = withNotLogin(async () => {
    toast("Chức năng đang hoàn thiện");
  });

  const onBookmark = withNotLogin(async () => {
    if (user && user.profile) {
      try {
        toast.promise(updateBookmark(mangaId, isBookmarked, user), {
          loading: "Đang cập nhật danh sách theo dõi...",
          success: () => {
            mutate("api_user");
            return "Cập nhật thành công";
          },
          error: "Cập nhật thất bại",
        });
      } catch (error) {}
    }
  });

  return (
    <>
      <NeedLoginDialog opened={opened} close={close} />

      <Button
        variant="outline"
        color="red.7"
        onClick={onLike}
        leftIcon={
          <IconHeart
            size={18}
            fill={isLiked ? theme.colors.red[7] : "transparent"}
          />
        }
      >
        {isLiked ? "Bỏ thích truyện" : "Thích truyện"}
      </Button>
      <Button
        variant="outline"
        color="yellow.7"
        onClick={onBookmark}
        leftIcon={
          <IconBookmark
            size={18}
            fill={isBookmarked ? theme.colors.yellow[7] : "transparent"}
          />
        }
      >
        {isBookmarked ? "Bỏ theo dõi" : "Theo dõi truyện"}
      </Button>
    </>
  );
};

export default MangaInfoCardFooterActions;
