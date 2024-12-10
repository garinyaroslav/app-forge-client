import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { ICart, TCart } from '../types/cart';

interface AddCartFormProps {
  getCartsAndWriteToState: () => void;
}

const fields = ['consumerId'];

export const AddCartForm: FC<AddCartFormProps> = ({
  getCartsAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<ICart>();

  const onSubmit: SubmitHandler<ICart> = async (data) => {
    let res;
    if (!Number.isNaN(Number(data.consumerId))) {
      res = await window.api.addCart({
        consumerId: Number(data.consumerId),
      });
    } else {
      res = null;
    }

    if (res) {
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
        }}
      />
    );
  };

  const renderFields = () => {
    return fields.map((field) => (
      <Flex
        key={field}
        alignItems={'center'}
        justifyContent={'space-between'}
        css={{ width: 450 }}
      >
        <Text>{field}</Text> {renderFieldEntrail(field)}
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
