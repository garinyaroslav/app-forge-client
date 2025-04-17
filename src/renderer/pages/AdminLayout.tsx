import { useState } from 'react';
import {
  TabsList,
  TabsTrigger,
  TabsRoot,
  Flex,
  Button,
} from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { mainTabValues as v } from '../types/mainTabValues';

import ArrawSvg from '../assets/arrowLeftBlack.svg';

export const AdminLayout = () => {
  const nav = useNavigate();
  const [tabVal, setTabVal] = useState<v>(v.products);

  return (
    <Flex css={{ h: '100%', w: '100%' }}>
      <TabsRoot
        orientation={'vertical'}
        value={tabVal}
        colorPalette="green"
        onValueChange={(e: any) => {
          setTabVal(e.value as v);
          nav(e.value);
        }}
      >
        <TabsList>
          <Flex css={{ mb: 6, mt: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => nav('/')}
              css={{ width: '120px', mt: 1 }}
              border="none"
              bg="#e5e7eb"
              color="#111827"
              _hover={{ bg: '#d1d1d1' }}
            >
              <img src={ArrawSvg} style={{ height: '18px' }} alt="arrow" />
              На главную
            </Button>
          </Flex>
          <TabsTrigger
            {...{
              value: v.products,
              color: '#111827',
              '&:hover': { bg: '#10b981' },
            }}
          >
            Продукты
          </TabsTrigger>
          <TabsTrigger
            {...{
              value: v.reviews,
              color: '#111827',
              '&:hover': { bg: '#10b981' },
            }}
          >
            Отзывы
          </TabsTrigger>
          <TabsTrigger
            {...{
              value: v.consumers,
              color: '#111827',
              '&:hover': { bg: '#10b981' },
            }}
          >
            Покупатели
          </TabsTrigger>
          <TabsTrigger
            {...{
              value: v.carts,
              color: '#111827',
              '&:hover': { bg: '#10b981' },
            }}
          >
            Корзины
          </TabsTrigger>
          <TabsTrigger
            {...{
              value: v.cartItems,
              color: '#111827',
              '&:hover': { bg: '#10b981' },
            }}
          >
            Элементы корзин
          </TabsTrigger>
          <TabsTrigger
            {...{
              value: v.librarys,
              color: '#111827',
              '&:hover': { bg: '#10b981' },
            }}
          >
            Библиотеки
          </TabsTrigger>
          <TabsTrigger
            {...{
              value: v.genres,
              color: '#111827',

              '&:hover': { bg: '#10b981' },
            }}
          >
            Жанры игр
          </TabsTrigger>
        </TabsList>
      </TabsRoot>
      <Outlet />
    </Flex>
  );
};
