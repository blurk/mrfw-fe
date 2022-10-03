import {
  ActionIcon,
  Button,
  Dialog,
  Group,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBookmark, IconHeart } from "@tabler/icons";
import Link from "next/link";
import toast from "react-hot-toast";
import client from "services/initPocketBase";
import { updateBookmark } from "services/mutator";
import { useSWRConfig } from "swr";
import { Profile } from "types";
import { useSession } from "utils";
import NeedLoginDialog from "./NeedLoginDialog";

type Props = {
  classes?: string;
  mangaId: string;
};

const MangaCardFooter = ({ classes = "", mangaId }: Props) => {
  const { user } = useSession();
  const { mutate } = useSWRConfig();

  const theme = useMantineTheme();

  const [opened, { close, open }] = useDisclosure(false);

  const isBookmarked = user?.profile?.bookmark?.includes(mangaId);

  const withNotLogin = (fn: () => void) => () => {
    if (client.authStore.isValid) {
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

      <Group spacing={8} mt="auto">
        <Tooltip label="Thích truyện" withArrow>
          <ActionIcon
            className={classes}
            aria-label="Thích truyện"
            onClick={onLike}
          >
            <IconHeart size={16} color={theme.colors.red[6]} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Theo dõi truyện" withArrow withinPortal>
          <ActionIcon
            className={classes}
            aria-label="Theo dõi truyện"
            onClick={onBookmark}
          >
            <IconBookmark
              size={16}
              color={theme.colors.yellow[7]}
              fill={isBookmarked ? theme.colors.yellow[7] : "transparent"}
            />
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  );
};

export default MangaCardFooter;
