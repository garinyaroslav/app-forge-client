import { FC, useEffect, useState } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
  Portal,
  DialogPositioner,
  Text,
} from '@chakra-ui/react';
import { Button } from './ui/button';
import { CloseButton } from './ui/close-button';
import { IGame } from '../types/game';
import { CartModalItem } from './CartModalItem';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

type TGameObj = IGame & { cartItemId: number };

export const CartModal: FC<CartModalProps> = ({ open, onClose }) => {
  const uid = localStorage.getItem('uid');
  const [cartItems, setCartItems] = useState<null | TGameObj[]>(null);

  const getItemsAndWriteToState = async () => {
    const g = await window.api.getCartGamesByUserId(uid).catch(console.error);

    if (g.length > 0) setCartItems(g);
    else setCartItems(null);
  };

  useEffect(() => {
    getItemsAndWriteToState();
  }, [open]);

  const defineSum = (items: null | TGameObj[]) => {
    if (items) return items.reduce((a, item) => a + Number(item.price), 0);
    return 0;
  };

  const renderItems = (items: TGameObj[]) => {
    return items.map((item) => (
      <CartModalItem
        key={item.id}
        gameObj={item}
        getItemsAndWriteToState={getItemsAndWriteToState}
      />
    ));
  };

  return (
    <DialogRoot
      open={open}
      size={'md'}
      onOpenChange={() => onClose()}
      placement={'center'}
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <DialogTitle>Моя корзина</DialogTitle>
              <CloseButton onClick={() => onClose()} />
            </DialogHeader>
            <DialogBody
              css={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {cartItems ? (
                renderItems(cartItems)
              ) : (
                <Text>Тут пока ничего нет...</Text>
              )}
            </DialogBody>
            <DialogFooter
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Text css={{ fontSize: 18, fontWeight: 600 }}>
                {cartItems
                  ? `Всего к оплате: ${defineSum(cartItems)} руб.`
                  : ''}
              </Text>
              {cartItems && <Button colorPalette={'green'}>Купить</Button>}
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
