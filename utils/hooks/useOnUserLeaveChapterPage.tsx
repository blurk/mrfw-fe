import { useLocalStorage, useWindowEvent, useWindowScroll } from '@mantine/hooks';

export default function useOnUserLeaveChapterPage(chapterId: string) {
  const [readHistory, setReadHistory] = useLocalStorage<{ [key: string]: number }>({
    key: 'readHistory',
    defaultValue: {},
  });

  const [scroll] = useWindowScroll();

  useWindowEvent('beforeunload', () => {
    readHistory[chapterId] = scroll.y;
    setReadHistory(readHistory);
  });
}
