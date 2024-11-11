import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
  InputAddon,
} from '@chakra-ui/react';
import { IGame } from '../types/game';
import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/search.svg';

export const Games = () => {
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    window.api
      .getGames()
      .then((g: IGame[]) => setGames(g))
      .catch(console.error);
  }, []);

  return (
    <Flex css={{ flex: 1 }}>
      <Flex
        css={{
          width: 470,
          height: '100%',
          background: '#111b21',
          borderRight: '1px solid #2f3b43',
        }}
        direction={'column'}
      >
        <Flex
          direction={'column'}
          css={{ height: 150, borderBottom: '1px solid #2f3b43', py: 3, px: 5 }}
        >
          <Flex
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={8}
          >
            <Heading>Список игр</Heading>
            <IconButton variant={'outline'}>
              <img style={{ height: 15 }} src={PlusSvg} alt={'plus'} />
            </IconButton>
          </Flex>
          <Group {...{ attached: true, flex: 1 }}>
            <Input placeholder="Поиск игр" />
            <InputAddon {...{ attached: true }}>
              <img style={{ height: 15 }} src={SearchSvg} alt={'search'} />
            </InputAddon>
          </Group>
        </Flex>
        <Box
          css={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: 0.5 },
            '&::-webkit-scrollbar-track': {
              width: 0.5,
              background: '#222e35',
            },
            '&::-webkit-scrollbar-thumb': {
              width: 0.5,
              backgroundColor: '#fff',
            },
          }}
        >
          {games.map((game) => (
            <Center
              key={game.id}
              css={{
                borderBottom: '1px solid #2f3b43',
                minHeight: 68,
                '&:hover': {
                  background: '#222e35',
                },
                cursor: 'pointer',
              }}
            >
              {game.title}
            </Center>
          ))}
          {games.map((game) => (
            <Center
              key={game.id}
              css={{ borderBottom: '1px solid #2f3b43', minHeight: 68 }}
            >
              {game.title}
            </Center>
          ))}
        </Box>
      </Flex>
      <Box>123</Box>
    </Flex>
  );
};
