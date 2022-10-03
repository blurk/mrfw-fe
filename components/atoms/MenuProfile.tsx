import { Avatar, Button, Menu, useMantineTheme } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconBook,
  IconBookmark,
  IconHeart,
  IconLogout,
  IconTrash,
  IconUser,
  IconUserCircle,
} from "@tabler/icons";
import Link from "next/link";
import Router from "next/router";
import { logout } from "services/initPocketBase";
import { getImageUrl, useSession } from "utils";

type Props = {};

const MenuProfile = ({}: Props) => {
  const { user, setUser } = useSession();

  const [showMenu, toggle] = useToggle([false, true] as const);

  const theme = useMantineTheme();

  const handleLogoutClick = () => {
    logout();
    setUser(null);
    Router.push("/login");
  };

  if (!user) {
    return (
      <Link href="/login" passHref>
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
            user.profile?.avatar ? (
              <Avatar
                src={getImageUrl(
                  "profiles",
                  user.profile.id,
                  user.profile.avatar
                )}
                size={24}
                radius="xl"
              />
            ) : (
              <IconUser size={18} />
            )
          }
          variant={user.profile ? "outline" : "gradient"}
        >
          {user.profile ? user.profile.name || "người dùng" : "Loading..."}
        </Button>
      </Menu.Target>

      {/* TODO: add this feats later */}
      <Menu.Dropdown>
        <Menu.Item
          disabled
          icon={
            <IconHeart size={14} stroke={1.5} color={theme.colors.red[6]} />
          }
        >
          Truyện đã thích
        </Menu.Item>
        <Link href="/manage/bookmark">
          <Menu.Item
            icon={
              <IconBookmark
                size={14}
                stroke={1.5}
                color={theme.colors.yellow[6]}
              />
            }
          >
            Truyện đang theo dõi
          </Menu.Item>
        </Link>
        {/* <Menu.Item
					disabled
					icon={
						<IconMessage size={14} stroke={1.5} color={theme.colors.blue[6]} />
					}>
					Bình luận của bạn
				</Menu.Item> */}

        <Menu.Divider />
        <Menu.Label>Quản lý</Menu.Label>
        <Link href="/manage/profile">
          <Menu.Item
            icon={
              <IconUserCircle
                size={14}
                stroke={1.5}
                color={theme.colors.green[6]}
              />
            }
          >
            Quản lý thông tin tài khoản
          </Menu.Item>
        </Link>
        <Link href="/manage">
          <Menu.Item
            icon={
              <IconBook size={14} stroke={1.5} color={theme.colors.green[6]} />
            }
          >
            Quản lý truyện của bạn
          </Menu.Item>
        </Link>
        <Menu.Item
          icon={<IconLogout size={14} stroke={1.5} />}
          onClick={handleLogoutClick}
        >
          Đăng xuất
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Vùng nguy hiểm</Menu.Label>

        {/* TODO: add this feat later */}
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} stroke={1.5} />}
          disabled
        >
          Xóa tài khoản
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuProfile;
