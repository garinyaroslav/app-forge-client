import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { EmptyState } from '../components/EmpatyState';
import { GameDitails } from '../components/GameDitails';
import { IGame } from '../types/game';

import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/search.svg';
import RemoveSvg from '../assets/remove.svg';
import { scrollBarStyles } from '../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';

export const Games = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<null | number>(null);
  const [deletedGameId, setDeletedGameId] = useState<null | number>(null);

  useEffect(() => {
    (async () => {
      const g = await window.api.getGames().catch(console.error);
      setGames(g);
    })();
  }, [deletedGameId]);

  const deleteGame = async () => {
    await window.api.deleteGame(selectedGameId);
    setDeletedGameId(null);
  };

  const renderGames = (gamesElems: IGame[]) =>
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
          minHeight: 68,
          '&:hover': {
            background: '#222e35',
          },
          cursor: 'pointer',
        }}
      >
        <Text>{`${gameElem.id}. ${gameElem.title}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedGameId(gameElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  return (
    <>
      {deletedGameId && (
        <DeleteConditionModal
          open={Boolean(deletedGameId)}
          onClose={() => setDeletedGameId(null)}
          onSubmit={deleteGame}
        />
      )}

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
            css={{
              height: 150,
              borderBottom: '1px solid #2f3b43',
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
              <Heading>Список игр</Heading>
              <IconButton {...{ variant: 'surface' }}>
                <img style={{ height: 12 }} src={PlusSvg} alt={'plus'} />
              </IconButton>
            </Flex>
            <Group {...{ attached: true, flex: 1 }}>
              <Input {...{ variant: 'outline', placeholder: 'Поиск игр' }} />
              <IconButton {...{ variant: 'surface' }}>
                <img style={{ height: 15 }} src={SearchSvg} alt={'search'} />
              </IconButton>
            </Group>
          </Flex>
          <Box css={scrollBarStyles}>
            {renderGames(games)}
            {renderGames(games)}
          </Box>
        </Flex>
        <Box css={{ flex: 1 }}>
          {selectedGameId ? (
            <GameDitails gameId={selectedGameId} />
          ) : (
            <EmptyState />
          )}
        </Box>
      </Flex>
    </>
  );
};
