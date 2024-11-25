import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { excludedFields } from '../utils/excludedFields';
import { ICartItem, TCartItem } from '../types/cartItem';

interface CartItemDitailsProps {
  cartItemId: number;
}

export const CartItemDitails: FC<CartItemDitailsProps> = ({ cartItemId }) => {
  const [CartItem, setCartItem] = useState<null | ICartItem>(null);
  const { register, handleSubmit } = useForm<ICartItem>({
    values: {
      ...CartItem,
    } as ICartItem,
  });

  const getCartItem = async () => {
    const data = await window.api.getCartItem(cartItemId).catch(console.error);

    setCartItem(data[0]);
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
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {Object.keys(CartItem)
            .filter((fieldName) => !excludedFields.includes(fieldName))
            .map((field) => (
              <Flex
                key={field}
                alignItems={'center'}
                justifyContent={'space-between'}
                css={{ width: 450 }}
              >
                <Text>{field}</Text>
                {renderFieldEntrail(field)}
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
