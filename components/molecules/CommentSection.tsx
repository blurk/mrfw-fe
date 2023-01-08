import { Anchor, Box, Button, Divider, Group, Paper, ScrollArea, Stack, Text, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconRefresh } from '@tabler/icons';
import Comment from 'components/atoms/Comment';
import { Comment as CommentDomain } from 'domains';
import React, { Fragment, useState } from 'react';
import client from 'services/initPocketBase';
import { COLLECTION, relativeTimeFromNow, useSession } from 'utils';
import useSWR from 'swr';
import { getMangaComments } from 'services/fetchers';
import Link from 'next/link';
import { Routes } from 'utils/routes';

type Props = {
  currentMangaId: string;
};

const CommentSection = ({ currentMangaId }: Props) => {
  const { user } = useSession();
  const [isCommenting, setIsCommenting] = useState(false);

  const { data, mutate } = useSWR<CommentDomain[] | undefined>(`${currentMangaId}-comments`, () =>
    getMangaComments(currentMangaId)
  );

  const { getInputProps, onSubmit, reset } = useForm({
    validate: {
      comment: (value) => (value.length === 0 ? 'Bình luận không được để trống' : null),
    },
    initialValues: {
      comment: '',
    },
  });

  const handleSubmit = async (values: { comment: string }) => {
    if (!data) return;

    setIsCommenting(true);

    try {
      const newComment = await client.collection(COLLECTION.COMMENTS).create({
        content: values.comment,
        by: user.id,
        on: currentMangaId,
      });

      await client.collection(COLLECTION.MANGAS).update(currentMangaId, {
        comments: [...data.map((manga) => manga.id), newComment.id],
      });

      mutate();

      showNotification({
        title: 'Thao tác thành công',
        message: 'Bình luận của bạn đã được thêm thành công',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      reset();
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: 'Bình luận của bạn chưa được thêm. Hãy thử lại nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Paper p="sm" mt="md" withBorder>
      <Title order={3}>Bình luận</Title>

      <ScrollArea h={data && data?.length > 3 ? 300 : undefined} mt="md" px="xl">
        <Stack>
          {data && data?.length > 0 ? (
            data.map((item) => (
              <Comment
                key={item.id}
                commentId={item.id}
                postedAt={relativeTimeFromNow(item.created)}
                body={item.content}
                swrKey={`${currentMangaId}-comments`}
                author={{
                  name: item.by === user?.id ? 'Bạn' : item.expand.by.name,
                  image: client.getFileUrl(item.expand.by as any, item.expand.by.avatar),
                  by: item.by,
                }}
              />
            ))
          ) : (
            <Text color="dimmed">Truyện chưa có bình luận nào.</Text>
          )}
        </Stack>
      </ScrollArea>

      {/* Comment Input */}
      <Box mt="md">
        <form onSubmit={onSubmit(handleSubmit)}>
          <Textarea
            placeholder="Bình luận của bạn"
            label="Bình luận"
            autosize
            minRows={2}
            maxRows={6}
            withAsterisk
            disabled={!user}
            {...getInputProps('comment')}
          />

          {user ? (
            <Button type="submit" mt="sm" ml="auto" display="block" loading={isCommenting} disabled={!user}>
              Bình luận
            </Button>
          ) : (
            <Text ml="auto" mt="sm" w="max-content" maw="100%">
              Hãy{' '}
              <Anchor component={Link} href={Routes.LOGIN}>
                đăng nhập
              </Anchor>{' '}
              để bình luận nhé
            </Text>
          )}
        </form>
      </Box>
    </Paper>
  );
};

export default CommentSection;
