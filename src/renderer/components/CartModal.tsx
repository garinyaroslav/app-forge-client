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
import { IProduct } from '../types/product';
import { CartModalItem } from './CartModalItem';
import { toaster, Toaster } from './ui/toaster';
import a from '../axios';
import { scrollBarStyles } from '../../utils/scrollBarStyles';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

type TProductObj = IProduct & { cart_item_id: number };

export const CartModal: FC<CartModalProps> = ({ open, onClose }) => {
  const [cartItems, setCartItems] = useState<null | TProductObj[]>(null);

  const getItemsAndWriteToState = async () => {
    try {
      const res = await a.get<TProductObj[]>('/software/cart/');
      const resData = res.data;

      if (resData.length > 0) setCartItems(resData);
      else setCartItems(null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getItemsAndWriteToState();
  }, [open]);

  const defineSum = (items: null | TProductObj[]) => {
    if (items)
      return items.reduce((a, item) => a + Number(item.price), 0).toFixed(2);
    return 0;
  };

  const buy = async () => {
    if (!cartItems) return;

    try {
      await a.post('/software/buy/');
      await getItemsAndWriteToState();
    } catch (e) {
      console.error(e);
    }

    toaster.create({
      description: 'Пирложение(ия) добавлены в вашу библиотеку',
      type: 'success',
    });
  };

  const renderItems = (items: TProductObj[]) => {
    return items.map((item) => (
      <CartModalItem
        key={item.id}
        productObj={item}
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
                maxHeight: 550,
                ...scrollBarStyles,
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
