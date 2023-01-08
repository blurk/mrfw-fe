import { Text, Avatar, Group, Paper, ActionIcon, Tooltip, Button, TextInput, Box, CloseButton } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconDeviceFloppy, IconEdit, IconFile, IconTrash } from '@tabler/icons';
import { deleteComment, updateComment } from 'domains';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { useSession } from 'utils';

interface CommentSimpleProps {
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
    by: string;
  };
  commentId: string;
  swrKey: string;
}

export default function Comment({ postedAt, body, author, commentId, swrKey }: CommentSimpleProps) {
  const { mutate } = useSWRConfig();

  const { user } = useSession();

  const [isEdit, setIsEdit] = useState(false);
  const [updateContent, setUpdateContent] = useState(body);

  const onUpdateClick = async () => {
    try {
      await updateComment(commentId, updateContent);
      mutate(swrKey);
      showNotification({
        title: 'Thao tác thành công',
        message: 'Bình luận của bạn đã được sửa thành công',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      setIsEdit(false);
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: 'Bình luận của bạn chưa được sửa. Hãy thử lại nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const onDeleteClick = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      mutate(swrKey);
      showNotification({
        title: 'Thao tác thành công',
        message: 'Bình luận của bạn đã được xóa thành công',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: 'Bình luận của bạn chưa được xóa. Hãy thử lại nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  return (
    <Paper shadow="xs" p="sm" withBorder>
      <Group align="flex-start">
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text size="sm">{author.name}</Text>
          <Text size="xs" color="dimmed">
            {postedAt}
          </Text>
        </div>

        {user && user.id === author.by && (
          <Group spacing={8}>
            <Tooltip label="Sửa bình luận">
              <ActionIcon size="sm" variant="filled" color="yellow" onClick={() => setIsEdit(true)}>
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa bình luận">
              <ActionIcon size="sm" variant="filled" color="red" onClick={() => onDeleteClick(commentId)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}
      </Group>

      {/* Edit Input */}
      <Box pl={54} pt="xs">
        {isEdit ? (
          <Group spacing={4}>
            <TextInput sx={{ flex: 1 }} value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} />
            <Tooltip label="Lưu">
              <ActionIcon color="blue" variant="filled" size="sm" onClick={() => onUpdateClick()}>
                <IconDeviceFloppy size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Hủy">
              <CloseButton color="red" variant="filled" size="sm" onClick={() => setIsEdit(false)} />
            </Tooltip>
          </Group>
        ) : (
          <Text size="sm">{body}</Text>
        )}
      </Box>
    </Paper>
  );
}
