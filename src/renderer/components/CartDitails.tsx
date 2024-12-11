import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { ICart, TCart } from '../types/cart';

interface CartDitailsProps {
  cartId: number;
}

const fields = [
  { lab: 'Идентификатор корзины', val: 'id' },
  { lab: 'Идентификатор пользователя', val: 'consumerId' },
];

export const CartDitails: FC<CartDitailsProps> = ({ cartId }) => {
  const [cart, setCart] = useState<null | ICart>(null);
  const { register, handleSubmit } = useForm<ICart>({
    values: {
      ...cart,
    } as ICart,
  });

  const getCart = async () => {
    const data = await window.api.getCart(cartId).catch(console.error);

    setCart(data[0]);
  };

  const onSubmit: SubmitHandler<ICart> = (data) => {
    console.log(data);
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TCart)}
        {...{
          variant: 'subtle',
          disabled: true,
          css: { width: 250 },
        }}
      />
    );
  };

  useEffect(() => {
    getCart();
  }, [cartId]);

  if (cart)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '80px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {fields.map((field) => (
            <Flex
              key={field.val}
              alignItems={'center'}
              justifyContent={'space-between'}
              css={{ width: 500 }}
            >
              <Text>{field.lab}</Text>
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
