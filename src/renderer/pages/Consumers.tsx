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
import { scrollBarStyles } from '../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import { IConsumer } from '../types/consumer';
import { ConsumerDitails } from '../components/ConsumerDitails';
import { AddConsumerForm } from '../components/AddConsumerForm';

export const Consumers = () => {
  const [consumers, setConsumers] = useState<IConsumer[]>([]);
  const [selectedConsumerId, setSelectedConsumerId] = useState<null | number>(
    null,
  );
  const [deletedConsumerId, setDeletedConsumerId] = useState<null | number>(
    null,
  );
  const [isConsumerAdded, setConsumerIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getConsumersAndWriteToState = async () => {
    const g = await window.api.getConsumers().catch(console.error);
    setConsumers(g);
  };

  const search = async (searchVal: string) => {
    const g = await window.api
      .getConsumersBySearchValue(searchVal)
      .catch(console.error);
    setConsumers(g);
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getConsumersAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getConsumersAndWriteToState();
  }, [deletedConsumerId]);

  const deleteConsumer = async () => {
    await window.api.deleteConsumer(deletedConsumerId);
    setDeletedConsumerId(null);
    toaster.create({
      description: 'Пользователь успешно удалён',
      type: 'success',
    });
  };

  const renderConsumers = (consumerElems: IConsumer[]) =>
    consumerElems.map((consumerElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedConsumerId(consumerElem.id)}
        key={consumerElem.id}
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
        <Text>{`${consumerElem.id}. ${consumerElem.username}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedConsumerId(consumerElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedConsumerId)
      return (
        <ConsumerDitails
          consumerId={selectedConsumerId}
          getConsumersAndWriteToState={getConsumersAndWriteToState}
        />
      );
    if (isConsumerAdded)
      return (
        <AddConsumerForm
          getConsumersAndWriteToState={getConsumersAndWriteToState}
        />
      );
    return <EmptyState />;
  };

  return (
    <>
      {deletedConsumerId && (
        <DeleteConditionModal
          open={Boolean(deletedConsumerId)}
          onClose={() => setDeletedConsumerId(null)}
          onSubmit={deleteConsumer}
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
              <Heading>Список пользователей</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedConsumerId(null);
                    setConsumerIsAdded(true);
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
                  placeholder: 'Поиск пользователей',
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
          <Box css={scrollBarStyles}>{renderConsumers(consumers)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
