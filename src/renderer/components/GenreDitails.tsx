import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { IGame } from '../types/game';
import { excludedFields } from '../utils/excludedFields';
import { IGameForm, TGameForm } from '../types/gameForm';
import { toaster } from './ui/toaster';

interface GenreDitailsProps {
  genreId: number;
  getGenresAndWriteToState: () => void;
}

export const GenreDitails: FC<GenreDitailsProps> = ({
  genreId,
  getGenresAndWriteToState,
}) => {
  const [genre, setGenre] = useState<null | IGame>(null);
  const [isEdited, setIsEdited] = useState(false);
  const { register, handleSubmit, reset } = useForm<IGameForm>({
    values: {
      ...genre,
    } as unknown as IGameForm,
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

  const onSubmit: SubmitHandler<IGameForm> = async (data) => {
    // const res = await window.api.updateGame({
    //   id: Number(data.id),
    //   title: data.title,
    // });
    //
    // if (res) {
    //   toaster.create({
    //     description: 'Жанр успешно обновлён',
    //     type: 'success',
    //   });
    // } else {
    //   toaster.create({
    //     description: 'Жанр не был обновлён',
    //     type: 'error',
    //   });
    // }
    onCancel();
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TGameForm)}
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
          {Object.keys(genre)
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
        </Flex>
        <Flex
          direction={'column'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
        >
          {isEdited ? (
            <Flex w={'100%'} justifyContent={'space-between'}>
              <Button onClick={onCancel} css={{ width: 150 }}>
                Отмена
              </Button>
              <Button type="submit" css={{ width: 150 }}>
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
      </form>
    );
  return null;
};
