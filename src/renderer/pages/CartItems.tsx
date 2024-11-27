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
import { ICartItem } from '../types/cartItem';
import { CartItemDitails } from '../components/CartItemDitails';
import { AddCartItemForm } from '../components/AddCartItemForm';

export const CartItems = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [selectedCartItemId, setSelectedCartItemId] = useState<null | number>(
    null,
  );
  const [deletedCartItemId, setDeletedCartItemId] = useState<null | number>(
    null,
  );
  const [isCartItemAdded, setCartItemIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getCartItemsAndWriteToState = async () => {
    const g = await window.api.getCartItems().catch(console.error);
    setCartItems(g);
  };

  const search = async (searchVal: string) => {
    const g = await window.api
      .getCartItemsBySearchValue(searchVal)
      .catch(console.error);
    setCartItems(g);
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getCartItemsAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getCartItemsAndWriteToState();
  }, [deletedCartItemId]);

  const deleteCartItem = async () => {
    await window.api.deleteCartItem(deletedCartItemId);
    setDeletedCartItemId(null);
    toaster.create({
      description: 'Элемент корзины успешно удалён',
      type: 'success',
    });
  };

  const renderCartItems = (cartItemElems: ICartItem[]) =>
    cartItemElems.map((cartItemElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedCartItemId(cartItemElem.id)}
        key={cartItemElem.id}
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
        <Text>{`${cartItemElem.id}. cartId: ${cartItemElem.cartId}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedCartItemId(cartItemElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedCartItemId)
      return <CartItemDitails cartItemId={selectedCartItemId} />;
    if (isCartItemAdded)
      return (
        <AddCartItemForm
          getCartItemsAndWriteToState={getCartItemsAndWriteToState}
        />
      );
    return <EmptyState />;
  };

  return (
    <>
      {deletedCartItemId && (
        <DeleteConditionModal
          open={Boolean(deletedCartItemId)}
          onClose={() => setDeletedCartItemId(null)}
          onSubmit={deleteCartItem}
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
              <Heading>Список элементов корзин</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedCartItemId(null);
                    setCartItemIsAdded(true);
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
                  placeholder: 'Поиск элементов',
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
          <Box css={scrollBarStyles}>{renderCartItems(cartItems)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
