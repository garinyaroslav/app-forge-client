import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowSvg from '../assets/arrowLeft.svg';

export const GameShopDitails = () => {
  const nav = useNavigate();
  const { gameId } = useParams();

  return (
    <Box>
      <Flex
        onClick={() => nav('/user/shop')}
        css={{
          gap: 3,
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <img src={ArrowSvg} style={{ height: '18px' }} alt="arrow" />
        <Text css={{ fontWeight: 600, fontSize: 14 }}>В магазин</Text>
      </Flex>
      {gameId}
    </Box>
  );
};
