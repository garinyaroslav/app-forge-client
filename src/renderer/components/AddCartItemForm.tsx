import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { ICartItem, TCartItem } from '../types/cartItem';

import a from '../../renderer/axios';

interface AddCartItemFormProps {
  getCartItemsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор корзины', val: 'cart' },
  { lab: 'Идентификатор продукта', val: 'product' },
];

export const AddCartItemForm: FC<AddCartItemFormProps> = ({
  getCartItemsAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<ICartItem>();

  const onSubmit: SubmitHandler<ICartItem> = async (data) => {
    if (Number.isNaN(Number(data.cart)) && Number.isNaN(Number(data.product))) {
      toaster.create({
        description: 'Элемент корзины не добавлен',
        type: 'error',
      });
      return;
    }

    let resData: null | ICartItem = null;

    try {
      let res = await a.post<ICartItem>(`/cart_item/`, {
        cart: Number(data.cart),
        product: Number(data.product),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Элемент корзины добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Элемент корзины не добавлен',
        type: 'error',
      });
    }

    reset();
    getCartItemsAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TCartItem, { required: true })}
        {...{
          variant: 'subtle',
          css: { width: 250 },
        }}
      />
    );
  };

  const renderFields = () => {
    return fields.map((field) => (
      <Flex
        key={field.val}
        alignItems={'center'}
        justifyContent={'space-between'}
        css={{ width: 500 }}
      >
        <Text>{field.lab}</Text> {renderFieldEntrail(field.val)}
      </Flex>
    ));
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {renderFields()}
          <Button type="submit" css={{ width: 200, ml: '250px', mt: 5 }}>
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
