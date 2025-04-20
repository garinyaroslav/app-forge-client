import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { IGenre, TGenre } from '../types/genre';
import a from '../../renderer/axios';

interface AddGenreFormProps {
  getGenresAndWriteToState: () => void;
}

const fields = [{ lab: 'Название жанра', val: 'name' }];

export const AddGenreForm: FC<AddGenreFormProps> = ({
  getGenresAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<IGenre>();

  const onSubmit: SubmitHandler<IGenre> = async (data) => {
    let resData: null | IGenre = null;

    try {
      let res = await a.post<IGenre>(`/genre/`, {
        name: data.name,
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Жанр успешно добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Жанр не добавлен',
        type: 'error',
      });
    }

    reset();
    getGenresAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TGenre, { required: true })}
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
