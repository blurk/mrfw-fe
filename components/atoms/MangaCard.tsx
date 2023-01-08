import { Anchor, Avatar, Badge, Card, Center, createStyles, Group, Space, Text, Tooltip } from '@mantine/core';
import { IconEye, IconUser } from '@tabler/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Manga } from 'domains';
import { COLLECTION, getImageUrl } from 'utils';
import BookmarkButton from './BookmarkButton';
import LikeButton from './LikeButton';

interface Props
  extends Pick<Manga, 'cover' | 'id' | 'title' | 'description' | 'collectionId' | 'expand' | 'upload_by'> {
  badgeText?: string;
  accentColor?: string;
}

export const MangaCard = ({
  cover,
  id,
  title,
  description,
  collectionId,
  expand,
  badgeText,
  accentColor,
  upload_by,
}: Props) => {
  const { classes } = useStyles();

  const href = `/manga/${id}`;

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section>
        <Anchor component={Link} href={href} className={classes.cover}>
          <Image src={getImageUrl(collectionId, id, cover, '300x300')} alt={title} width={300} height={300} priority />
        </Anchor>
      </Card.Section>

      {badgeText && (
        <Badge
          className={classes.badge}
          variant="gradient"
          color="red"
          gradient={{ from: `${accentColor}.4`, to: `${accentColor}.8` }}
        >
          {badgeText}
        </Badge>
      )}

      <Text
        className={classes.title}
        weight={500}
        component={Link}
        href={href}
        variant="link"
        lineClamp={1}
        title={title}
      >
        {title}
      </Text>

      <Text size="sm" color="dimmed" lineClamp={4} sx={{ height: 86 }}>
        {description}
      </Text>

      {/* FOOTER */}
      <Group position="apart" className={classes.footer}>
        <Center>
          <Tooltip label={`Đăng bởi ${expand?.upload_by?.name ?? 'người dùng'}`} withArrow>
            <Group spacing={2}>
              {expand?.upload_by?.avatar ? (
                <Avatar
                  src={getImageUrl(COLLECTION.USERS, expand.upload_by.id, expand.upload_by.avatar)}
                  size={24}
                  radius="xl"
                />
              ) : (
                <IconUser size={18} />
              )}

              <Text size="sm" inline ml={4} sx={{ maxWidth: '10ch' }} lineClamp={1}>
                {expand?.upload_by?.name || 'người dùng'}
              </Text>
            </Group>
          </Tooltip>

          <Space w="xs" />
          <Tooltip label="Lượt xem" withArrow>
            <Center>
              <IconEye size={18} />
              <Text size="sm" inline ml={4}>
                {expand?.view.count ?? 0}
              </Text>
            </Center>
          </Tooltip>
        </Center>

        <Group spacing={8} mt="auto">
          <Tooltip label="Thích truyện" withArrow>
            <span>
              <LikeButton classes={classes.action} mangaId={id} onlyIcon />
            </span>
          </Tooltip>

          <Tooltip label="Theo dõi truyện" withArrow withinPortal>
            <span>
              <BookmarkButton classes={classes.action} mangaId={id} onlyIcon uploadBy={upload_by} />
            </span>
          </Tooltip>
        </Group>
      </Group>
    </Card>
  );
};

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  cover: {
    position: 'relative',
    height: 180,
    width: '100%',
    aspectRatio: '1',
    display: 'block',
    overflow: 'hidden',
  },

  badge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: 'none',
  },

  title: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs / 2,
  },

  action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));
