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

import ArrawSvg from '../assets/arrowLeft.svg';

export const AdminLayout = () => {
  const nav = useNavigate();
  const [tabVal, setTabVal] = useState<v>(v.products);

  return (
    <Flex css={{ h: '100%', w: '100%' }}>
      <TabsRoot
        css={{ borderRight: '1px solid #2f3b43', pl: 2, py: 2 }}
        orientation={'vertical'}
        value={tabVal}
        onValueChange={(e: any) => {
          setTabVal(e.value as v);
          nav(e.value);
        }}
      >
        <TabsList>
          <Flex css={{ mb: 6, mt: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => nav('/')}
              variant={'surface'}
              css={{ width: '120px' }}
            >
              <img src={ArrawSvg} style={{ height: '18px' }} alt="arrow" />
              На главную
            </Button>
          </Flex>
          <TabsTrigger {...{ value: v.products }}>Продукты</TabsTrigger>
          <TabsTrigger {...{ value: v.reviews }}>Отзывы</TabsTrigger>
          <TabsTrigger {...{ value: v.consumers }}>Покупатели</TabsTrigger>
          <TabsTrigger {...{ value: v.carts }}>Корзины</TabsTrigger>
          <TabsTrigger {...{ value: v.cartItems }}>Элементы корзин</TabsTrigger>
          <TabsTrigger {...{ value: v.librarys }}>Библиотеки</TabsTrigger>
          <TabsTrigger {...{ value: v.genres }}>Жанры игр</TabsTrigger>
        </TabsList>
      </TabsRoot>
      <Outlet />
    </Flex>
  );
};
