import { ActionIcon, Anchor, Button, Grid, Group, Indicator, List, Popover, Text, Title, Tooltip } from '@mantine/core';
import { IconBell, IconCheck, IconTrash } from '@tabler/icons';
import { markAsRead, removeNotification } from 'domains/notifications';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getCurrentUserNotifications } from 'services/fetchers';
import useSWR from 'swr';
import { relativeTimeFromNow, SWR_USER_KEY, useSession } from 'utils';
import { Routes } from 'utils/routes';

type Props = {};

const UserNotificationList = (props: Props) => {
  const { user } = useSession();

  const [isFilter, setIsFilter] = useState(false);

  const { data, mutate } = useSWR(user?.id ? SWR_USER_KEY.NOTIFICATION : undefined, () =>
    getCurrentUserNotifications(user.id)
  );

  const onMarkAsReadClick = async (id: string) => {
    try {
      await markAsRead(id);
      mutate();
    } catch (error) {}
  };

  const onRemoveClick = async (id: string) => {
    try {
      await removeNotification(id);
      mutate();
    } catch (error) {}
  };

  const unreadNotifications = useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.filter((item) => !item.isRead).length;
  }, [data]);

  const renderedData = useMemo(() => {
    if (!data) {
      return [];
    }

    if (isFilter) {
      return data.filter((item) => !item.isRead);
    }

    return data;
  }, [data, isFilter]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Popover width={320} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Indicator
            color="red"
            overflowCount={99}
            label={unreadNotifications}
            inline
            size={18}
            showZero={false}
            dot={false}
          >
            <ActionIcon>
              <IconBell size={22} />
            </ActionIcon>
          </Indicator>
        </Popover.Target>
        {/* Noti list */}
        <Popover.Dropdown p={'sx'}>
          <Title order={3}>Thông báo</Title>

          <Group my="sm">
            <Button
              variant="gradient"
              compact
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={() => setIsFilter(false)}
            >
              Tất cả
            </Button>

            <Button
              variant="gradient"
              compact
              gradient={{ from: 'orange', to: 'red' }}
              onClick={() => setIsFilter(true)}
            >
              Chưa đọc
            </Button>
          </Group>

          {renderedData.length === 0 ? (
            <Text color="dimmed"> Bạn chưa có thông báo nào cả.</Text>
          ) : (
            <>
              <List spacing="xs" size="sm" center listStyleType="none" mt="sm">
                {renderedData.map((item) => (
                  <List.Item key={item.id} mt="sm" p="sm">
                    <Grid w="100%">
                      {/* Content */}
                      <Grid.Col
                        span={10}
                        sx={{
                          filter: `grayscale(${item.isRead ? '1' : '0'})`,
                        }}
                      >
                        {item.type === 'new_chapter' && (
                          <Anchor
                            component={Link}
                            href={Routes.MANGA_CHAPTER + item.expand.of_chapter.id}
                            onClick={() => onMarkAsReadClick(item.id)}
                          >
                            Chương mới của {item.expand.of_chapter.expand.belong_to.title}:{' '}
                            {item.expand.of_chapter.name}
                            <br />
                          </Anchor>
                        )}

                        {item.type === 'new_comment' && (
                          <Anchor
                            component={Link}
                            href={Routes.MANGA + item.of_manga}
                            onClick={() => onMarkAsReadClick(item.id)}
                          >
                            Truyện của bạn: {item.expand.of_manga.title} vừa có người bình luận
                            <br />
                          </Anchor>
                        )}

                        <Text variant="text" size="xs" color="dimmed">
                          {relativeTimeFromNow(item.created)}
                        </Text>
                      </Grid.Col>

                      {/* Actions */}
                      <Grid.Col span={2}>
                        <Group noWrap spacing={0}>
                          <Tooltip label="Đánh dấu là đã đọc" disabled={item.isRead}>
                            <ActionIcon color="teal" disabled={item.isRead} onClick={() => onMarkAsReadClick(item.id)}>
                              <IconCheck size={16} />
                            </ActionIcon>
                          </Tooltip>

                          <Tooltip label="Xóa thông báo">
                            <ActionIcon color="red" onClick={() => onRemoveClick(item.id)}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </List.Item>
                ))}
              </List>
            </>
          )}
        </Popover.Dropdown>
      </Popover>
    </>
  );
};

export default UserNotificationList;
