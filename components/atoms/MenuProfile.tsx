import { ActionIcon, Avatar, Button, Indicator, Menu, Text, useMantineTheme } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import {
  IconBell,
  IconBook,
  IconBookmark,
  IconHeart,
  IconLogout,
  IconMessage,
  IconTrash,
  IconUser,
  IconUserCircle,
} from '@tabler/icons';
import Link from 'next/link';
import Router from 'next/router';
import client, { logout } from 'services/initPocketBase';
import { deleteAccount } from 'services/mutator';
import { useSession } from 'utils';
import { useOnNewChapterAdded } from 'utils/hooks/useOnNewChapterAdded';
import { Routes } from 'utils/routes';

type Props = {};

const MenuProfile = ({}: Props) => {
  const { user, setUser } = useSession();

  const [showMenu, toggle] = useToggle([false, true] as const);

  const theme = useMantineTheme();

  const handleLogoutClick = () => {
    logout();
    setUser(null);
    Router.push(Routes.LOGIN);
  };

  const handleDeleteAccountClick = () => {
    deleteAccount(user.id);
  };

  useOnNewChapterAdded();

  if (!user) {
    return (
      <Link href={Routes.LOGIN} passHref>
        <Button variant="gradient">Đăng nhập</Button>
      </Link>
    );
  }

  return (
    <Menu
      opened={showMenu}
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      onClose={toggle.bind(false)}
      onOpen={toggle.bind(true)}
    >
      <Menu.Target>
        <Button
          leftIcon={
            user.avatar ? (
              <Avatar src={client.getFileUrl(user, user.avatar)} size={24} radius="xl" />
            ) : (
              <IconUser size={18} />
            )
          }
          variant={user ? 'outline' : 'gradient'}
        >
          {user ? user.name || 'người dùng' : 'Loading...'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Text component={Link} href={Routes.MANAGE_LIKED}>
          <Menu.Item icon={<IconHeart size={14} stroke={1.5} color={theme.colors.red[6]} />}>Truyện đã thích</Menu.Item>
        </Text>

        <Text component={Link} href={Routes.MANAGE_BOOKMARK}>
          <Menu.Item icon={<IconBookmark size={14} stroke={1.5} color={theme.colors.yellow[6]} />}>
            Truyện đang theo dõi
          </Menu.Item>
        </Text>
        <Menu.Item disabled icon={<IconMessage size={14} stroke={1.5} color={theme.colors.blue[6]} />}>
          Bình luận của bạn
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Quản lý</Menu.Label>
        <Text component={Link} href={Routes.MANAGE_PROFILE}>
          <Menu.Item icon={<IconUserCircle size={14} stroke={1.5} color={theme.colors.green[6]} />}>
            Quản lý thông tin tài khoản
          </Menu.Item>
        </Text>
        <Text component={Link} href={Routes.MANAGE_MANGA}>
          <Menu.Item icon={<IconBook size={14} stroke={1.5} color={theme.colors.green[6]} />}>
            Quản lý truyện của bạn
          </Menu.Item>
        </Text>
        <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} onClick={handleLogoutClick}>
          Đăng xuất
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Vùng nguy hiểm</Menu.Label>

        <Menu.Item color="red" icon={<IconTrash size={14} stroke={1.5} />} onClick={handleDeleteAccountClick}>
          Xóa tài khoản
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuProfile;
