import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import { EmptyState } from '../components/EmpatyState';
import { IGenre } from '../types/genre';

import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/search.svg';
import RemoveSvg from '../assets/remove.svg';
import { scrollBarStyles } from '../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';

export const GameGenres = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<null | number>(null);
  const [deletedGameId, setDeletedGameId] = useState<null | number>(null);
  const [isGameAdded, setGameIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getGenresAndWriteToState = async () => {
    const g = await window.api.getGenres().catch(console.error);
    setGenres(g);
  };

  const search = async (searchVal: string) => {
    //   const g = await window.api
    //     .getGamesBySearchValue(searchVal)
    //     .catch(console.error);
    //   setGames(g);
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    // const val = e.target.value;
    // if (val.length === 0) getGamesAndWriteToState();
    // setSearchValue(val);
  };

  useEffect(() => {
    getGenresAndWriteToState();
  }, [deletedGameId]);

  const deleteGame = async () => {
    // await window.api.deleteGame(selectedGameId);
    // setDeletedGameId(null);
    // toaster.create({
    //   description: 'Файл успешно удалён',
    //   type: 'success',
    // });
  };

  const renderGenres = (genreElems: IGenre[]) =>
    genreElems.map((genreElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedGenreId(genreElem.id)}
        key={genreElem.id}
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
        <Text>{`${genreElem.id}. ${genreElem.genreName}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedGameId(genreElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedGenreId)
      return (
        <GameDitails
          gameId={selectedGameId}
          getGamesAndWriteToState={getGamesAndWriteToState}
        />
      );
    // if (isGameAdded)
    //   return <AddGameForm getGamesAndWriteToState={getGamesAndWriteToState} />;
    return <EmptyState />;
  };

  return (
    <>
      {deletedGameId && (
        <DeleteConditionModal
          open={Boolean(deletedGameId)}
          onClose={() => setDeletedGameId(null)}
          onSubmit={deleteGame}
        />
      )}
      <Toaster />
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
              <Heading>Список жанров игр</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedGenreId(null);
                    setGameIsAdded(true);
                  },
                  variant: 'surface',
                }}
              >
                <img style={{ height: 12 }} src={PlusSvg} alt={'plus'} />
              </IconButton>
            </Flex>
            <Group {...{ attached: true, flex: 1 }}>
              <Input
                {...{
                  value: searchValue,
                  onChange: onChangeSearchValue,
                  variant: 'outline',
                  placeholder: 'Поиск жанров',
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') search(searchValue);
                  },
                }}
              />
              <IconButton
                {...{ onClick: () => search(searchValue), variant: 'surface' }}
              >
                <img style={{ height: 15 }} src={SearchSvg} alt={'search'} />
              </IconButton>
            </Group>
          </Flex>
          <Box css={scrollBarStyles}>{renderGenres(genres)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
