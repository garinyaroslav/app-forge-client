import {
  Box,
  Text,
  Flex,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { StoreTabValues } from '../types/storeTabValues';

import ArrowSvg from '../assets/arrowLeft.svg';

export const Store = () => {
  const nav = useNavigate();
  const [tabVal, setTabVal] = useState<StoreTabValues>(StoreTabValues.shop);
  const [userName, setUserName] = useState<null | string>(null);

  useEffect(() => {
    const name = localStorage.getItem('username');
    if (!name) return;

    setUserName(name.toUpperCase());
  }, []);

  return (
    <Box css={{ height: '100%' }}>
      <Flex
        css={{
          height: '50px',
          background: '#111b21',
          borderBottom: '1px solid #000',
          px: 10,
          boxShadow: '0px 0px 7px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Flex
          onClick={() => nav('/')}
          css={{
            gap: 3,
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <img src={ArrowSvg} style={{ height: '18px' }} alt="arrow" />
          <Text css={{ fontWeight: 600, fontSize: 14 }}>Выйти</Text>
        </Flex>
        <Box css={{ flex: 1 }}>
          <TabsRoot
            css={{ border: 'none', mr: '78px' }}
            justify={'center'}
            value={tabVal}
            onValueChange={(e: any) => {
              setTabVal(e.value);
              nav(e.value);
            }}
          >
            <TabsList {...{ borderBottom: 'none' }}>
              <TabsTrigger {...{ value: StoreTabValues.shop }}>
                МАГАЗИН
              </TabsTrigger>
              <TabsTrigger {...{ value: StoreTabValues.library }}>
                БИБЛИОТЕКА
              </TabsTrigger>
              <TabsTrigger {...{ value: StoreTabValues.profile }}>
                {userName ?? 'ПРОФИЛЬ'}
              </TabsTrigger>
            </TabsList>
          </TabsRoot>
        </Box>
      </Flex>
      <Outlet />
    </Box>
  );
};
