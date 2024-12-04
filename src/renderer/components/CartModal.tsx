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

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export const CartModal: FC<CartModalProps> = ({ open, onClose }) => {
  const uid = localStorage.getItem('uid');
  const [cartItems, setCartItems] = useState<null | IGame[]>(null);

  const getItemsAndWriteToState = async () => {
    const g = await window.api.getCartGamesByUserId(uid).catch(console.error);

    setCartItems(g);
  };

  useEffect(() => {
    getItemsAndWriteToState();
  }, []);

  const renderItems = (items: null | IGame[]) => {
    if (items) return items.map((item) => item.id + ' ');
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
            <DialogBody>{renderItems(cartItems)}</DialogBody>
            <DialogFooter
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Text css={{ fontSize: 18, fontWeight: 600 }}>
                Всего к оплате: 123 руб.
              </Text>
              <Button colorPalette={'green'}>Купить</Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
