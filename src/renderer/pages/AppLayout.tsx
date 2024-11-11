import { FC } from 'react';
import { Box, TabsList, TabsTrigger, TabsRoot } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { mainTabValues as v } from '../types/mainTabValues';

interface AppLayoutProps {
  tabVal: string;
  setTabVal: (v: v) => void;
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
        <TabsRoot
          justify={'center'}
          value={tabVal}
          onValueChange={(e: any) => setTabVal(e.value as v)}
        >
          <TabsList>
            <TabsTrigger {...{ value: v.games }}>Games</TabsTrigger>
            <TabsTrigger {...{ value: v.review }}>Reviews</TabsTrigger>
            <TabsTrigger {...{ disabled: true, value: v.consumers }}>
              Consumers
            </TabsTrigger>
            <TabsTrigger {...{ value: v.carts }}>Carts</TabsTrigger>
            <TabsTrigger {...{ value: v.cartItems }}>Cart items</TabsTrigger>
            <TabsTrigger {...{ value: v.library }}>Library</TabsTrigger>
            <TabsTrigger {...{ value: v.gemeGenres }}>Game ganres</TabsTrigger>
          </TabsList>
        </TabsRoot>
        <Outlet />
      </Box>
    </Box>
  );
};
