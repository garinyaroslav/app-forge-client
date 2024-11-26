import { Box, Button, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [tabVal, setTabVal] = useState('login');
  const nav = useNavigate();

  return (
    <Box>
      <Button onClick={() => nav('admin/games')}>admin</Button>
      <Button onClick={() => nav('user')}>user</Button>
      <Box css={{ w: '500px', m: '100px auto' }}>
        <TabsRoot
          // css={{ border: '1px solid #2f3b43', pl: 2, py: 2 }}
          variant={'outline'}
          justify={'center'}
          value={tabVal}
          onValueChange={(e: any) => setTabVal(e.value)}
        >
          <TabsList>
            <TabsTrigger {...{ value: 'login' }}>Войти</TabsTrigger>
            <TabsTrigger {...{ value: 'register' }}>Регистрация</TabsTrigger>
          </TabsList>
        </TabsRoot>
      </Box>
    </Box>
  );
};
