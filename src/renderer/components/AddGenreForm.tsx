import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { IGenre, TGenre } from '../types/genre';

interface AddGenreFormProps {
  getGenresAndWriteToState: () => void;
}

const fields = [{ lab: 'Название жанра', val: 'genreName' }];

export const AddGenreForm: FC<AddGenreFormProps> = ({
  getGenresAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<IGenre>();

  const onSubmit: SubmitHandler<IGenre> = async (data) => {
    const res = await window.api.addGenre({
      genreName: data.genreName,
    });

    if (res) {
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
        <Text>{field.lab}</Text>
        {renderFieldEntrail(field.val)}
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
