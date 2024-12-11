import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { IGame } from '../types/game';
import { toaster } from './ui/toaster';
import { IGenre, TGenre } from '../types/genre';

interface GenreDitailsProps {
  genreId: number;
  getGenresAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор жанра', val: 'id' },
  { lab: 'Название жанра', val: 'genreName' },
];

export const GenreDitails: FC<GenreDitailsProps> = ({
  genreId,
  getGenresAndWriteToState,
}) => {
  const [genre, setGenre] = useState<null | IGame>(null);
  const [isEdited, setIsEdited] = useState(false);
  const { register, handleSubmit, reset } = useForm<IGenre>({
    values: {
      ...genre,
    } as IGenre,
  });

  const getGenre = async () => {
    const data = await window.api.getGenre(genreId).catch(console.error);

    setGenre(data[0]);
  };

  const onCancel = async () => {
    await reset();
    getGenre();
    getGenresAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IGenre> = async (data) => {
    const res = await window.api.updateGenre({
      id: Number(data.id),
      genreName: data.genreName,
    });

    if (res) {
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
          <Flex
            mt={5}
            direction={'column'}
            alignItems={'flex-end'}
            justifyContent={'space-between'}
          >
            {isEdited ? (
              <Flex w={'100%'} justifyContent={'space-between'}>
                <Button onClick={onCancel} css={{ width: 200 }}>
                  Отмена
                </Button>
                <Button type="submit" css={{ width: 200 }}>
                  Готово
                </Button>
              </Flex>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => setIsEdited(true)}
                  css={{ width: 200 }}
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
