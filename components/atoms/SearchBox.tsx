import { Player } from '@lottiefiles/react-lottie-player';
import { Avatar, Group, List, Loader, Popover, Stack, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { searchManga } from 'services/fetchers';
import useSWR from 'swr';
import { Manga } from 'domains';
import { getImageUrl } from 'utils';

const Result = ({ manga, onClick }: { manga: Manga; onClick: () => void }) => {
  const authors = useMemo(() => {
    if (manga.expand?.author) {
      return manga.expand?.author.map((_author) => _author.name);
    }

    return [];
  }, [manga.expand?.author]);

  return (
    <List.Item
      icon={<Avatar alt={manga.title} src={getImageUrl(manga.collectionId, manga.id, manga.cover)} />}
      sx={(theme) => ({
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.colors.blue[0],
        },
      })}
      onClick={onClick}
    >
      <Link href={`/manga/${manga.id}`}>
        <Stack spacing={4}>
          <Text color="blue">{manga.title}</Text>
          <Text size="xs" color="dimmed">
            {authors}
          </Text>
        </Stack>
      </Link>
    </List.Item>
  );
};

function SearchBox() {
  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 1000);

  const { data, error, isValidating } = useSWR(debounced ? debounced : null, searchManga);

  return (
    <Popover width="target" position="bottom" shadow="md" opened={searchValue.length > 0}>
      <Popover.Target>
        <TextInput
          value={searchValue}
          placeholder="Tìm kiếm truyện..."
          onChange={(e) => setSearchValue(e.target.value)}
          icon={<IconSearch size={18} />}
        />
      </Popover.Target>
      <Popover.Dropdown>
        {((!data && !error) || isValidating) && (
          <Group position="center" py="sm">
            <Loader />
          </Group>
        )}
        {data &&
          (data.length === 0 ? (
            <Group spacing="xs" position="center" align="center">
              <Text size="lg" color="dark.4">
                Không tìm thấy truyện
              </Text>

              <Player
                autoplay
                loop
                src="/lottie-files/no-data.json"
                style={{
                  width: '20px',
                  aspectRatio: '1',
                }}
              />
            </Group>
          ) : (
            <List spacing="xs" size="sm" center>
              {data.map((manga) => (
                <Result manga={manga} key={manga.id} onClick={() => setSearchValue('')} />
              ))}
            </List>
          ))}
      </Popover.Dropdown>
    </Popover>
  );
}

export default SearchBox;
