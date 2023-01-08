import { ActionIcon, Button, useMantineTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons';
import { updateLiked } from 'services/mutator';
import { useSWRConfig } from 'swr';
import { SWR_USER_KEY, useSession } from 'utils';
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

  const isLiked = user?.liked?.includes(mangaId);

  const onClick = async () => {
    if (user) {
      try {
        await updateLiked(mangaId, isLiked, user);
        mutate('api_user');

        if (user) {
          mutate(SWR_USER_KEY.LIKED);
        }
      } catch (error) {
        console.error(error);
      }
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
