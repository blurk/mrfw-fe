import { ActionIcon, Button, useMantineTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons';
import toast from 'react-hot-toast';
import { updateLiked } from 'services/mutator';
import { useSWRConfig } from 'swr';
import { useSession } from 'utils';
import useNeedLoginDialog from 'utils/hooks/useNeedLoginDialog';

type Props = {
  mangaId: string;
  onlyIcon?: boolean;
  classes?: string;
};

const LikeButton = ({ mangaId, onlyIcon, classes }: Props) => {
  const theme = useMantineTheme();
  const { user } = useSession();
  const { mutate } = useSWRConfig();

  const { show } = useNeedLoginDialog();

  const isLiked = user?.profile?.liked?.includes(mangaId);

  const onClick = () => {
    if (user && user.profile) {
      try {
        toast.promise(updateLiked(mangaId, isLiked, user), {
          loading: 'Đang cập nhật danh sách truyện thích...',
          success: () => {
            mutate('api_user');
            return isLiked ? 'Bỏ thích thành công' : 'Thích thành công';
          },
          error: 'Có lỗi xảy ra ;_;',
        });
      } catch (error) {}
    } else {
      show();
    }
  };

  return onlyIcon ? (
    <ActionIcon className={classes} aria-label="Thích truyện" onClick={onClick}>
      <IconHeart size={16} color={theme.colors.red[7]} fill={isLiked ? theme.colors.red[7] : 'transparent'} />
    </ActionIcon>
  ) : (
    <Button
      variant="outline"
      color="red.7"
      onClick={onClick}
      leftIcon={<IconHeart size={18} fill={isLiked ? theme.colors.red[7] : 'transparent'} />}
    >
      {isLiked ? 'Bỏ thích' : 'Thích truyện'}
    </Button>
  );
};

export default LikeButton;
