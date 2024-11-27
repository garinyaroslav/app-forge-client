import {
  Box,
  Button,
  Flex,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Login } from '../components/Login';
import { Register } from '../components/Register';

import logo from '../assets/playforge.svg';

export const Auth = () => {
  const [tabVal, setTabVal] = useState('login');
  const nav = useNavigate();

  return (
    <Box>
      <Button onClick={() => nav('admin/games')}>admin</Button>
      <Button onClick={() => nav('user')}>user</Button>
      <Flex
        align={'center'}
        direction={'column'}
        css={{ w: '500px', m: '0 auto' }}
      >
        <img style={{ height: 150, marginBottom: 80 }} src={logo} alt="logo" />
        <TabsRoot
          css={{ border: 'none' }}
          justify={'center'}
          value={tabVal}
          onValueChange={(e: any) => setTabVal(e.value)}
        >
          <TabsList {...{ borderBottom: 'none', css: { mb: '50px' } }}>
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
