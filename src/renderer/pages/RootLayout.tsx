import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <Box
      css={{
        width: '100vw',
        height: '100vh',
        background: '	#f1f5f9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        css={{
          width: 1600,
          height: 900,
          background: '#f8fafc',
          boxShadow: '0px 0px 7px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
