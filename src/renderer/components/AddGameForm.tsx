import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Flex,
  Image,
  Input,
  Text,
  Heading,
  Textarea,
  Button,
  Box,
} from '@chakra-ui/react';
import { EmptyState } from './ui/empty-state';
import { IGameForm, TGameForm } from '../types/gameForm';
import { scrollBarStyles } from '../utils/scrollBarStyles';
import { IGame } from '../types/game';
import { Toaster, toaster } from './ui/toaster';

interface AddGameFormProps {
  getGamesAndWriteToState: () => void;
}

const fields = [
  'id',
  'title',
  'description',
  'developerName',
  'rating',
  'image',
  'price',
  'copiesSold',
  'gameGenreId',
  'relDate',
];

export const AddGameForm: FC<AddGameFormProps> = ({
  getGamesAndWriteToState,
}) => {
  const [games, setGames] = useState<IGame[]>([]);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [maxId, setMaxId] = useState(0);
  const { register, handleSubmit, reset } = useForm<IGameForm>({
    values: { id: maxId + 1 } as IGameForm,
  });

  const defineMaxId = () =>
    setMaxId(games.reduce((a, game) => (game.id > a ? game.id : a), 0));

  useEffect(() => {
    defineMaxId();
  }, [games]);

  const getGames = async () => {
    const g = await window.api.getGames().catch(console.error);
    setGames(g);
  };

  useEffect(() => {
    getGames();
  }, []);

  const onSubmit: SubmitHandler<IGameForm> = async (data) => {
    const arrayBuffer = await data.image.item(0)?.arrayBuffer();
    const uInt8ArrayImage = new Uint8Array(arrayBuffer as ArrayBuffer);

    await window.api.addGame({
      id: Number(data.id),
      title: data.title,
      description: data.description,
      developerName: data.developerName,
      rating: Number(data.rating),
      price: Number(data.price),
      copiesSold: Number(data.copiesSold),
      gameGenreId: Number(data.gameGenreId),
      relDate: Number(data.relDate),
      image: uInt8ArrayImage,
    });

    toaster.create({
      description: 'Игра успешно добавлена',
      type: 'success',
    });

    reset();
    getGames();
    getGamesAndWriteToState();
  };

  const handleChangeFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'description')
      return (
        <Textarea
          {...register(field, { required: true })}
          {...{
            variant: 'subtle',
            css: { width: 250, height: 250, ...scrollBarStyles },
          }}
        />
      );
    if (field === 'image')
      return (
        <input
          {...register('image', { required: true })}
          onChange={handleChangeFiles}
          type="file"
          accept="image/*"
          alt="alsdfjl"
        />
      );
    return (
      <Input
        {...register(field as TGameForm, { required: true })}
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
        <Text>{field}</Text>
        {renderFieldEntrail(field)}
      </Flex>
    ));
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '80px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {renderFields()}
        </Flex>
        <Flex
          direction={'column'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
        >
          <Box>
            <Heading css={{ mb: 5 }}>Изображение игры</Heading>
            {imageSrc ? (
              <Image
                css={{ height: 300, width: 350 }}
                src={imageSrc}
                alt="photo"
              />
            ) : (
              <EmptyState
                {...{
                  css: { height: 300, width: 350 },
                  title: 'Ничего не выбрано',
                  description: 'Выберите игру из списка',
                }}
              />
            )}
          </Box>
          <Button type="submit" css={{ width: 200 }}>
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
