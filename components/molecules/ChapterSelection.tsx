import { Player } from '@lottiefiles/react-lottie-player';
import { Group, Select, Text } from '@mantine/core';
import Router from 'next/router';

type Props = {
  defaultValue: string;
  data: { value: string; label: string }[];
};

const NothingFound = () => (
  <Group spacing={4} position="center">
    <Text color="dimmed" size="lg">
      Không tìm thấy
    </Text>

    <Player
      autoplay
      loop
      src="/lottie-files/no-data.json"
      style={{
        width: '18px',
        aspectRatio: '1',
      }}
    />
  </Group>
);

const ChapterSelection = ({ defaultValue, data }: Props) => (
  <Select
    style={{
      flex: 1,
    }}
    searchable
    defaultValue={defaultValue}
    data={data}
    placeholder="Tìm chương"
    onChange={(item) => {
      Router.push(`/manga/c/${item}`);
    }}
    nothingFound={<NothingFound />}
  />
);

export default ChapterSelection;
