import { Player } from '@lottiefiles/react-lottie-player';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Paper py="md" sx={{ height: 400 }}>
          <Stack justify="center" sx={{ height: '100%' }}>
            <Title order={2} color="red" align="center" mb="md">
              Bị lỗi mất rồi
            </Title>
            <Text component="p" align="center">
              Bạn hãy thử F5 để tải lại trang hoặc vào lại sau 1 lúc nhé.
            </Text>
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
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
