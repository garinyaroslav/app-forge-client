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

import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/search.svg';
import RemoveSvg from '../assets/remove.svg';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import { ILibrary } from '../types/library';
import { LibraryDitails } from '../components/LibraryDitails';
import { AddLibraryForm } from '../components/AddLibraryFrom';

export const Libraries = () => {
  const [libraries, setLibraries] = useState<ILibrary[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<null | number>(
    null,
  );
  const [deletedLibraryId, setDeletedLibraryId] = useState<null | number>(null);
  const [isLibraryAdded, setLibraryIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getLibrariesAndWriteToState = async () => {
    const g = await window.api.getLibraries().catch(console.error);
    setLibraries(g);
  };

  const search = async (searchVal: string) => {
    const g = await window.api
      .getLibrariesBySearchValue(searchVal)
      .catch(console.error);
    setLibraries(g);
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getLibrariesAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getLibrariesAndWriteToState();
  }, [deletedLibraryId]);

  const deleteLibrary = async () => {
    const res = await window.api.deleteLibrary(deletedLibraryId);

    if (res) {
      toaster.create({
        description: 'Библиотека успешно удалена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Библиотека не удалена',
        type: 'error',
      });
    }
    setDeletedLibraryId(null);
  };

  const renderLibraries = (libraryElems: ILibrary[]) =>
    libraryElems.map((libraryElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedLibraryId(libraryElem.id)}
        key={libraryElem.id}
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
        <Text>{`${libraryElem.id}. gameId: ${libraryElem.gameId} - consumerId: ${libraryElem.consumerId}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedLibraryId(libraryElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedLibraryId)
      return (
        <LibraryDitails
          libraryId={selectedLibraryId}
          getLibrariesAndWriteToState={getLibrariesAndWriteToState}
        />
      );
    if (isLibraryAdded)
      return (
        <AddLibraryForm
          getLibrariesAndWriteToState={getLibrariesAndWriteToState}
        />
      );
    return <EmptyState />;
  };

  return (
    <>
      {deletedLibraryId && (
        <DeleteConditionModal
          open={Boolean(deletedLibraryId)}
          onClose={() => setDeletedLibraryId(null)}
          onSubmit={deleteLibrary}
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
              <Heading>Список библиотек</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedLibraryId(null);
                    setLibraryIsAdded(true);
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
                  placeholder: 'Поиск библиотек',
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
          <Box css={scrollBarStyles}>{renderLibraries(libraries)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
