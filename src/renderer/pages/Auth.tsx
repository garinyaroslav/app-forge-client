import { Box, Flex, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { useState } from 'react';

import { Login } from '../components/Login';
import { Register } from '../components/Register';

import logo from '../assets/playforge.svg';

export const Auth = () => {
  const [tabVal, setTabVal] = useState('login');

  return (
    <Box>
      <Flex
        align={'center'}
        direction={'column'}
        css={{ w: '500px', m: '50px auto' }}
      >
        <img style={{ height: 150, marginBottom: 50 }} src={logo} alt="logo" />
        <TabsRoot
          css={{ border: 'none' }}
          justify={'center'}
          value={tabVal}
          onValueChange={(e: any) => setTabVal(e.value)}
        >
          <TabsList {...{ borderBottom: 'none', css: { mb: '40px' } }}>
            <TabsTrigger {...{ value: 'login' }}>Войти</TabsTrigger>
            <TabsTrigger {...{ value: 'register' }}>Регистрация</TabsTrigger>
          </TabsList>
        </TabsRoot>
        {tabVal === 'login' && <Login />}
        {tabVal === 'register' && <Register />}
      </Flex>
    </Box>
  );
};
