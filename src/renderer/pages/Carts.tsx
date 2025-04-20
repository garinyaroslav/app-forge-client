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
import SearchSvg from '../assets/searchWhite.svg';
import RemoveSvg from '../assets/remove.svg';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import { ICart } from '../types/cart';
import { CartDitails } from '../components/CartDitails';
import { AddCartForm } from '../components/AddCartForm';
import a from '../../renderer/axios';

export const Carts = () => {
  const [carts, setCarts] = useState<ICart[]>([]);
  const [selectedCartId, setSelectedCartId] = useState<null | number>(null);
  const [deletedCartId, setDeletedCartId] = useState<null | number>(null);
  const [isCartAdded, setCartIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getCartsAndWriteToState = async () => {
    try {
      const res = await a.get<ICart[]>('/cart/');
      setCarts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const search = async (searchVal: string) => {
    try {
      const res = await a.get<ICart[]>(`/cart/?search=${searchVal}`);
      setCarts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getCartsAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getCartsAndWriteToState();
  }, [deletedCartId]);

  const deleteCart = async () => {
    let resData: ICart | null = null;

    try {
      const res = await a.delete(`/cart/?id=${deletedCartId}`);
      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData !== null) {
      toaster.create({
        description: 'Корзина успешно удалена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Корзина не удалена',
        type: 'error',
      });
    }
    setDeletedCartId(null);
  };

  const renderCarts = (cartElems: ICart[]) =>
    cartElems.map((cartElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedCartId(cartElem.id)}
        key={cartElem.id}
        css={{
          pl: 6,
          pr: 4.5,
          borderBottom: '1px solid #2f3b43',
          minHeight: 68,
          '&:hover': {
            background: '#fff',
            color: '#111827',
          },
          cursor: 'pointer',
        }}
      >
        <Text>{`${cartElem.id}. Корзина пользователя: ${cartElem.consumer}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedCartId(cartElem.id),
          }}
        >
          <img style={{ height: 20 }} src={RemoveSvg} alt={'search'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedCartId) return <CartDitails cartId={selectedCartId} />;
    if (isCartAdded)
      return <AddCartForm getCartsAndWriteToState={getCartsAndWriteToState} />;
    return <EmptyState />;
  };

  return (
    <>
      {deletedCartId && (
        <DeleteConditionModal
          open={Boolean(deletedCartId)}
          onClose={() => setDeletedCartId(null)}
          onSubmit={deleteCart}
        />
      )}
      <Toaster />
      <Flex css={{ flex: 1 }}>
        <Flex
          css={{
            width: 470,
            height: '100%',
            background: '#10b981',
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
              <Heading>Список корзин пользователей</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedCartId(null);
                    setCartIsAdded(true);
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
                  placeholder: 'Поиск корзин',
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') search(searchValue);
                  },
                  colorPalette: 'green',
                  bg: '#e5e7eb',
                  color: '#111827',
                  css: {
                    border: 'none',
                  },
                }}
              />
              <IconButton
                {...{ onClick: () => search(searchValue), variant: 'surface' }}
              >
                <img style={{ height: 20 }} src={SearchSvg} alt={'search'} />
              </IconButton>
            </Group>
          </Flex>
          <Box css={scrollBarStyles}>{renderCarts(carts)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
