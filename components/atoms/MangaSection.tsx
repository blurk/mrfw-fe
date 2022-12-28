import { Player } from '@lottiefiles/react-lottie-player';
import { Carousel } from '@mantine/carousel';
import { Box, Paper, Stack, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import { Manga } from 'domains';
import { MangaCard } from './MangaCard';

type Props = {
  sectionTitle: string;
  data: Manga[];
  itemBadgeText: string;
  accentColor: string;
};

const MangaSection = ({ sectionTitle, data, itemBadgeText, accentColor }: Props) => {
  const theme = useMantineTheme();

  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const slides = useMemo(() => {
    if (data.length === 0) {
      return (
        <Carousel.Slide>
          <Paper py="md" sx={{ height: 400 }}>
            <Stack justify="center" sx={{ height: '100%' }}>
              <Title order={2} color="dimmed" align="center" mb="md">
                Không có {sectionTitle.toLocaleLowerCase()} rồi.
              </Title>
              <Player
                autoplay
                loop
                src="/lottie-files/no-data.json"
                style={{
                  height: '150px',
                  aspectRatio: '1',
                }}
              />
            </Stack>
          </Paper>
        </Carousel.Slide>
      );
    }

    return data.map((item) => (
      <Carousel.Slide key={item.id}>
        <MangaCard badgeText={itemBadgeText} accentColor={accentColor} {...item} />
      </Carousel.Slide>
    ));
  }, [accentColor, data, itemBadgeText, sectionTitle]);

  return (
    <Box>
      <Title order={2} color={accentColor}>
        {sectionTitle}
      </Title>
      <Carousel
        draggable={data.length !== 0}
        height={400}
        slideSize={data.length === 0 ? '100%' : '30%'}
        slideGap="xl"
        align="start"
        mt="md"
        slidesToScroll={mobile ? 1 : 3}
        breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
        styles={{
          control: {
            '&[data-inactive]': {
              opacity: 0,
              cursor: 'default',
            },
          },
        }}
      >
        {slides}
      </Carousel>
    </Box>
  );
};

export default MangaSection;
