import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { ILibrary, TLibrary } from '../types/library';
import { USADateToUnix } from '../../utils/USADateToUnix';
import a from '../../renderer/axios';

interface AddLibraryFormProps {
  getLibrariesAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор продукта', val: 'product' },
  { lab: 'Идентификатор пользователя', val: 'consumer' },
  { lab: 'Дата добавления', val: 'added_date' },
];

export const AddLibraryForm: FC<AddLibraryFormProps> = ({
  getLibrariesAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<ILibrary>();

  const onSubmit: SubmitHandler<ILibrary> = async (data) => {
    let resData: null | ILibrary = null;

    if (
      Number.isNaN(Number(data.product)) &&
      Number.isNaN(Number(data.consumer))
    ) {
      toaster.create({
        description: 'Отзыв не добавлен',
        type: 'error',
      });
      return;
    }

    try {
      let res = await a.post<ILibrary>(`/library/`, {
        product: Number(data.product),
        consumer: Number(data.consumer),
        added_date: USADateToUnix(String(data.added_date)),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Библиотека успешно добалена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Библиотека не добавлена',
        type: 'error',
      });
    }

    reset();
    getLibrariesAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'added_date')
      return (
        <Input
          type="date"
          {...register(field as TLibrary)}
          {...{
            variant: 'subtle',
            css: { width: 250 },
            colorPalette: 'green',
            bg: '#e5e7eb',
            color: '#111827',
          }}
        />
      );
    return (
      <Input
        {...register(field as TLibrary, { required: true })}
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
        <Text color="#111827">{field.lab}</Text>
        {renderFieldEntrail(field.val)}
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
