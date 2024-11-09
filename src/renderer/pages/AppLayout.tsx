import { FC } from 'react';
import { Box, Tabs } from '@chakra-ui/react';

interface AppLayoutProps {
  tabVal: string;
  setTabVal: (v: string) => void;
}

export const AppLayout: FC<AppLayoutProps> = ({ tabVal, setTabVal }) => {
  return (
    <Box
      css={{
        width: '100vw',
        height: '100vh',
        background: '#262524',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        css={{
          width: 1600,
          height: 900,
          background: '#222e35',
          boxShadow: '0px 0px 7px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Tabs.Root
          justify={'center'}
          value={tabVal}
          onValueChange={(e) => setTabVal(e.value)}
        >
          <Tabs.List>
            <Tabs.Trigger value="GAMES">Games</Tabs.Trigger>
            <Tabs.Trigger value="REVIEW">Reviews</Tabs.Trigger>
            <Tabs.Trigger disabled value="CONSUMERS">
              Consumers
            </Tabs.Trigger>
            <Tabs.Trigger value="CARTS">Carts</Tabs.Trigger>
            <Tabs.Trigger value="CAERT_ITEMS">Cart items</Tabs.Trigger>
            <Tabs.Trigger value="LIBRARY">Library</Tabs.Trigger>
            <Tabs.Trigger value="GAME_GENRES">Game ganres</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Box>
    </Box>
  );
};
