import { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { GameCard } from '../components/GameCard';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { IGame } from '../types/game';

export const Shop = () => {
  const [games, setGames] = useState<
    (IGame & { gameGenres: { genreName: string } })[]
  >([]);

  const getGamesAndWriteToState = async () => {
    const g = await window.api.getGamesList().catch(console.error);
    setGames(g);
  };

  useEffect(() => {
    getGamesAndWriteToState();
  }, []);

  return (
    <Flex css={{ height: 'calc(100% - 100px)' }}>
      <Box
        css={{
          width: 1000,
          height: 'calc(100% - 15px)',
          m: '30px auto',
        }}
      >
        <Text css={{ fontSize: 22, fontWeight: 600, mb: 4 }}>Все игры</Text>
        <Box css={{ height: '94%', ...scrollBarStyles }}>
          {games.map((game) => (
            <GameCard key={game.id} gameObj={game} />
          ))}
        </Box>
      </Box>
    </Flex>
  );
};
