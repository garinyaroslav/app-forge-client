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
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import { GenreDitails } from '../components/GenreDitails';
import { AddGenreForm } from '../components/AddGenreForm';
import a from '../../renderer/axios';

export const Genres = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<null | number>(null);
  const [deletedGenreId, setDeletedGenreId] = useState<null | number>(null);
  const [isGenreAdded, setGenreIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getGenresAndWriteToState = async () => {
    try {
      const res = await a.get<IGenre[]>('/genre/');
      setGenres(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const search = async (searchVal: string) => {
    try {
      const res = await a.get<IGenre[]>(`/genre/?search=${searchVal}`);
      setGenres(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getGenresAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getGenresAndWriteToState();
  }, [deletedGenreId]);

  const deleteGame = async () => {
    let resData: IGenre | null = null;

    try {
      const res = await a.delete(`/genre/?id=${deletedGenreId}`);
      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData !== null) {
      toaster.create({
        description: 'Жанр успешно удалён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Жанр не удалён',
        type: 'error',
      });
    }
    setDeletedGenreId(null);
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
        <Text>{`${genreElem.id}. ${genreElem.name}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedGenreId(genreElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedGenreId)
      return (
        <GenreDitails
          genreId={selectedGenreId}
          getGenresAndWriteToState={getGenresAndWriteToState}
        />
      );
    if (isGenreAdded)
      return (
        <AddGenreForm getGenresAndWriteToState={getGenresAndWriteToState} />
      );
    return <EmptyState />;
  };

  return (
    <>
      {deletedGenreId && (
        <DeleteConditionModal
          open={Boolean(deletedGenreId)}
          onClose={() => setDeletedGenreId(null)}
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
                    setGenreIsAdded(true);
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
