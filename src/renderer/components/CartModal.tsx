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
  const uid = localStorage.getItem('uid');
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
    //TODO create one endpoint for this
    if (!cartItems) return;

    for (let i = 0; i < cartItems.length; i++) {
      // const newLibElem = {
      //   productId: cartItems[i].id,
      //   consumerId: uid,
      //   addedDate: Math.floor(Date.now() / 1000),
      // };

      (async () => {
        try {
          await a.post<TProductObj[]>('/library/my/', {
            product_id: cartItems[i].id,
          });
        } catch (e) {
          console.error(e);
        }
        // await window.api.addLibrary(newLibElem).catch(console.error);

        // await window.api
        //   .incProductCopiesSoldById(cartItems[i].id)
        //   .catch(console.error);
      })();
    }

    try {
      await a.delete('/software/cart_items/');
    } catch (e) {
      console.error(e);
    }
    // await window.api.deleteCartProductsByUserId(uid).catch(console.error);

    await getItemsAndWriteToState();

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
