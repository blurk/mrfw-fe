import { Indicator, ActionIcon, Drawer, Text, List, ThemeIcon } from '@mantine/core';
import { IconBell, IconCircleCheck, IconCircleDashed } from '@tabler/icons';
import React, { useMemo, useState } from 'react';
import { getCurrentUserNotifications } from 'services/fetchers';
import useSWR from 'swr';
import { SWR_USER_KEY, useSession } from 'utils';

type Props = {};

const UserNotificationList = (props: Props) => {
  const { user } = useSession();

  const [opened, setOpened] = useState(false);

  const { data } = useSWR(user?.id ? SWR_USER_KEY.NOTIFICATION : undefined, () => getCurrentUserNotifications(user.id));

  const unreadNotifications = useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.filter((item) => !item.isRead).length;
  }, [data]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Indicator
        color="red"
        overflowCount={99}
        label={unreadNotifications}
        inline
        size={18}
        showZero={false}
        dot={false}
      >
        <ActionIcon onClick={() => setOpened(true)}>
          <IconBell size={22} />
        </ActionIcon>
      </Indicator>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Thông báo của bạn"
        padding="xl"
        size="30%"
        position="right"
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        {!data || data?.length === 0 ? (
          <Text> Bạn chưa có thông báo nào cả.</Text>
        ) : (
          <>
            <List spacing="xs" size="sm" center>
              {data.map((item) => (
                <List.Item key={item.id}>{item.expand.of_chapter.name}</List.Item>
              ))}
            </List>
          </>
        )}
      </Drawer>
    </>
  );
};

export default UserNotificationList;
