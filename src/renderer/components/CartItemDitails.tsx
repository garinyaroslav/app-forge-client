import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { ICartItem, TCartItem } from '../types/cartItem';
import a from '../../renderer/axios';

interface CartItemDitailsProps {
  cartItemId: number;
}

const fields = [
  { lab: 'Идентификатор элемента корзины', val: 'id' },
  { lab: 'Идентификатор корзины', val: 'cart' },
  { lab: 'Идентификатор продукта', val: 'product' },
];

export const CartItemDitails: FC<CartItemDitailsProps> = ({ cartItemId }) => {
  const [CartItem, setCartItem] = useState<null | ICartItem>(null);
  const { register, handleSubmit } = useForm<ICartItem>({
    values: {
      ...CartItem,
    } as ICartItem,
  });

  const getCartItem = async () => {
    try {
      const res = await a.get<ICartItem>(`/cart_item/?id=${cartItemId}`);
      const resData = res.data;
      setCartItem(resData);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit: SubmitHandler<ICartItem> = (data) => {
    console.log(data);
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TCartItem)}
        {...{
          variant: 'subtle',
          disabled: true,
          css: { width: 250 },
          colorPalette: 'green',
          bg: '#e5e7eb',
          color: '#111827',
        }}
      />
    );
  };

  useEffect(() => {
    getCartItem();
  }, [cartItemId]);

  if (CartItem)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '80px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5, color: '#111827' }}>Свойства</Heading>
          {fields.map((field) => (
            <Flex
              key={field.val}
              alignItems={'center'}
              justifyContent={'space-between'}
              css={{ width: 500 }}
            >
              <Text color="#111827">{field.lab}</Text>
              {renderFieldEntrail(field.val)}
            </Flex>
          ))}
          <Button hidden type="submit">
            1
          </Button>
        </Flex>
      </form>
    );
  return null;
};
