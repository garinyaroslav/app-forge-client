import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { IGenre, TGenre } from '../types/genre';
import a from '../../renderer/axios';

interface GenreDitailsProps {
  genreId: number;
  getGenresAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор жанра', val: 'id' },
  { lab: 'Название жанра', val: 'name' },
];

export const GenreDitails: FC<GenreDitailsProps> = ({
  genreId,
  getGenresAndWriteToState,
}) => {
  const [genre, setGenre] = useState<null | IGenre>(null);
  const [isEdited, setIsEdited] = useState(false);
  const { register, handleSubmit, reset } = useForm<IGenre>({
    values: {
      ...genre,
    } as IGenre,
  });

  const getGenre = async () => {
    try {
      const res = await a.get<IGenre>(`/genre/?id=${genreId}`);
      const resData = res.data;
      setGenre(resData);
    } catch (e) {
      console.error(e);
    }
  };

  const onCancel = async () => {
    await reset();
    getGenre();
    getGenresAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IGenre> = async (data) => {
    let resData: null | IGenre = null;

    try {
      let res = await a.put<IGenre>(`/genre/?id=${data.id}`, {
        name: data.name,
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Жанр успешно обновлён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Жанр не был обновлён',
        type: 'error',
      });
    }
    onCancel();
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TGenre)}
        {...{
          variant: 'subtle',
          disabled: !isEdited || field === 'id',
          css: { width: 250 },
          colorPalette: 'green',
          bg: '#e5e7eb',
          color: '#111827',
        }}
      />
    );
  };

  useEffect(() => {
    getGenre();
  }, [genreId]);

  if (genre)
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
          <Flex
            mt={5}
            direction={'column'}
            alignItems={'flex-end'}
            justifyContent={'space-between'}
          >
            {isEdited ? (
              <Flex w={'100%'} justifyContent={'space-between'}>
                <Button
                  onClick={onCancel}
                  bg="#e5e7eb"
                  color="#111827"
                  _hover={{ bg: '#d1d1d1' }}
                  css={{ width: 200 }}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  bg="#e5e7eb"
                  color="#111827"
                  _hover={{ bg: '#d1d1d1' }}
                  css={{ width: 200 }}
                >
                  Готово
                </Button>
              </Flex>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => setIsEdited(true)}
                  css={{ width: 200 }}
                  bg="#e5e7eb"
                  color="#111827"
                  _hover={{ bg: '#d1d1d1' }}
                >
                  Изменить
                </Button>
                <Button hidden type="submit">
                  1
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </form>
    );
  return null;
};
