import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ILibGame } from '../types/game';
import { EmptyState } from '../components/EmpatyState';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { ShopLibraryDitails } from '../components/ShopLibraryDitails';

export const Library = () => {
  const uid = localStorage.getItem('uid');
  const [libGames, setLibGames] = useState<null | ILibGame[]>(null);
  const [selectedGameId, setSelectedGameId] = useState<null | number>(null);

  const getLibGames = async () => {
    const res = await window.api.getGamesFromUserLib(uid).catch(console.error);

    setLibGames(res);
  };

  useEffect(() => {
    getLibGames();
  }, []);

  const renderGames = (gamesElems: ILibGame[]) =>
    gamesElems.map((gameElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedGameId(gameElem.id)}
        key={gameElem.id}
        css={{
          pl: 6,
          pr: 4.5,
          borderBottom: '1px solid #2f3b43',
          minHeight: 50,
          '&:hover': {
            background: '#222e35',
          },
          cursor: 'pointer',
        }}
      >
        <Text>{gameElem.title}</Text>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedGameId && libGames)
      return (
        <ShopLibraryDitails
          gameObj={
            libGames.find((obj) => obj.id === selectedGameId) as ILibGame
          }
        />
      );
    return <EmptyState />;
  };

  return (
    <Flex css={{ flex: 1, h: '94.5%' }}>
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
          css={{
            height: '60px',
            borderBottom: '3px solid #2f3b43',
            py: 3,
            px: 5,
          }}
        >
          <Flex
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={8}
          >
            <Heading>Моя библиотека</Heading>
          </Flex>
        </Flex>
        <Box css={scrollBarStyles}>
          {libGames ? renderGames(libGames) : null}
        </Box>
      </Flex>
      <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
    </Flex>
  );
};
