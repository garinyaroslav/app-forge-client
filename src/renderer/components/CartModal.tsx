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
import { toaster, Toaster } from './ui/toaster';

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
    if (items)
      return items.reduce((a, item) => a + Number(item.price), 0).toFixed(2);
    return 0;
  };

  const buy = async () => {
    if (cartItems) {
      for (let i = 0; i < cartItems.length; i++) {
        const newLibElem = {
          gameId: cartItems[i].id,
          consumerId: uid,
          addedDate: Math.floor(Date.now() / 1000),
        };

        window.api.addLibrary(newLibElem).catch(console.error);
      }

      await window.api.deleteCartGamesByUserId(uid).catch(console.error);

      for (let i = 0; i < cartItems.length; i++) {
        window.api.incGameCopiesSoldById(cartItems[i].id).catch(console.error);
      }

      await getItemsAndWriteToState();

      toaster.create({
        description: 'Игрa(ы) добавлены в вашу корзину',
        type: 'success',
      });
    }
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
      <Toaster />
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
              {cartItems && (
                <Button onClick={() => buy()} colorPalette={'green'}>
                  Купить
                </Button>
              )}
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
