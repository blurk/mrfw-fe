import { ActionIcon, Button, useMantineTheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons';
import toast from 'react-hot-toast';
import { updateBookmark } from 'services/mutator';
import { useSWRConfig } from 'swr';
import { useSession } from 'utils';
import useNeedLoginDialog from 'utils/hooks/useNeedLoginDialog';

type Props = {
  mangaId: string;
  onlyIcon?: boolean;
  classes?: string;
};

const BookmarkButton = ({ mangaId, onlyIcon, classes }: Props) => {
  const theme = useMantineTheme();
  const { user } = useSession();
  const { mutate } = useSWRConfig();

  const { show } = useNeedLoginDialog();

  const isBookmarked = user?.profile?.bookmark?.includes(mangaId);

  const onClick = () => {
    if (user && user.profile) {
      try {
        toast.promise(updateBookmark(mangaId, isBookmarked, user), {
          loading: 'Đang cập nhật danh sách theo dõi...',
          success: () => {
            mutate('api_user');
            return 'Cập nhật thành công';
          },
          error: 'Cập nhật thất bại',
        });
      } catch (error) {}
    } else {
      show();
    }
  };

  return onlyIcon ? (
    <ActionIcon className={classes} aria-label="Theo dõi truyện" onClick={onClick}>
      <IconBookmark
        size={16}
        color={theme.colors.yellow[7]}
        fill={isBookmarked ? theme.colors.yellow[7] : 'transparent'}
      />
    </ActionIcon>
  ) : (
    <Button
      variant="outline"
      color="yellow.7"
      onClick={onClick}
      leftIcon={<IconBookmark size={18} fill={isBookmarked ? theme.colors.yellow[7] : 'transparent'} />}
    >
      {isBookmarked ? 'Bỏ theo dõi' : 'Theo dõi truyện'}
    </Button>
  );
};

export default BookmarkButton;
