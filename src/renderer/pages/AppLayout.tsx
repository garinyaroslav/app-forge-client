import { FC } from 'react';
import { Box, TabsList, TabsTrigger, TabsRoot, Flex } from '@chakra-ui/react';
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
      <Flex
        css={{
          width: 1600,
          height: 900,
          background: '#222e35',
          boxShadow: '0px 0px 7px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        <TabsRoot
          css={{ borderRight: '1px solid #2f3b43', pl: 2, py: 2 }}
          orientation={'vertical'}
          value={tabVal}
          onValueChange={(e: any) => setTabVal(e.value as v)}
        >
          <TabsList>
            <TabsTrigger {...{ value: v.games }}>Игры</TabsTrigger>
            <TabsTrigger {...{ value: v.review }}>Отзывы</TabsTrigger>
            <TabsTrigger {...{ value: v.consumers }}>Покупатели</TabsTrigger>
            <TabsTrigger {...{ value: v.carts }}>Корзины</TabsTrigger>
            <TabsTrigger {...{ value: v.cartItems }}>
              Элементы корзин
            </TabsTrigger>
            <TabsTrigger {...{ value: v.library }}>Библиотеки</TabsTrigger>
            <TabsTrigger {...{ value: v.gemeGenres }}>Жанры игр</TabsTrigger>
          </TabsList>
        </TabsRoot>
        <Outlet />
      </Flex>
    </Box>
  );
};
