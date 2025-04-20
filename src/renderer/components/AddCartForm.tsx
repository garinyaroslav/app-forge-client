import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { ICart, TCart } from '../types/cart';

import a from '../../renderer/axios';

interface AddCartFormProps {
  getCartsAndWriteToState: () => void;
}

const fields = [{ lab: 'Идентификатор пользователя', val: 'consumer' }];

export const AddCartForm: FC<AddCartFormProps> = ({
  getCartsAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<ICart>();

  const onSubmit: SubmitHandler<ICart> = async (data) => {
    if (Number.isNaN(Number(data.consumer))) {
      toaster.create({
        description: 'Корзина успешно добавлена',
        type: 'success',
      });
      return;
    }

    let resData: null | ICart = null;

    try {
      let res = await a.post<ICart>(`/cart/`, {
        consumer: Number(data.consumer),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Корзина успешно добавлена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Корзина не добавлена',
        type: 'error',
      });
    }

    reset();
    getCartsAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TCart, { required: true })}
        {...{
          variant: 'subtle',
          css: { width: 250 },
          colorPalette: 'green',
          bg: '#e5e7eb',
          color: '#111827',
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
        <Text color="#111827">{field.lab}</Text> {renderFieldEntrail(field.val)}
      </Flex>
    ));
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5, color: '#111827' }}>Свойства</Heading>
          {renderFields()}
          <Button
            type="submit"
            bg="#e5e7eb"
            color="#111827"
            _hover={{ bg: '#d1d1d1' }}
            css={{ width: 200, ml: '250px', mt: 5 }}
          >
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
