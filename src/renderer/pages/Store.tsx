import { Box } from '@chakra-ui/react';

export const Store = () => {
  return <Box>{localStorage.getItem('uid')}</Box>;
};
