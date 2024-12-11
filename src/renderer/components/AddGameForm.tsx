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
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { Toaster, toaster } from './ui/toaster';
import { USADateToUnix } from '../../utils/USADateToUnix';
import { IGenre } from '../types/genre';

interface AddGameFormProps {
  getGamesAndWriteToState: () => void;
}

const fields = [
  { lab: 'Название игры', val: 'title' },
  { lab: 'Описание игры', val: 'description' },
  { lab: 'Разработчик', val: 'developerName' },
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Изображение игры', val: 'image' },
  { lab: 'Цена', val: 'price' },
  { lab: 'Продано копий', val: 'copiesSold' },
  { lab: 'Жанр', val: 'gameGenreId' },
  { lab: 'Дата релиза', val: 'relDate' },
];

export const AddGameForm: FC<AddGameFormProps> = ({
  getGamesAndWriteToState,
}) => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [genreOptions, setGenreOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { register, handleSubmit, reset } = useForm<IGameForm>({});

  const getGenresAndWriteToState = async () => {
    const g = await window.api.getGenres().catch(console.error);

    setGenreOptions(
      g.map((genreObj: IGenre) => ({
        value: genreObj.id,
        label: genreObj.genreName,
      })),
    );
  };

  useEffect(() => {
    getGenresAndWriteToState();
  }, []);

  const onSubmit: SubmitHandler<IGameForm> = async (data) => {
    const arrayBuffer = await data.image.item(0)?.arrayBuffer();
    const uInt8ArrayImage = new Uint8Array(arrayBuffer as ArrayBuffer);

    let res;
    if (
      !Number.isNaN(Number(data.rating)) &&
      !Number.isNaN(Number(data.price)) &&
      !Number.isNaN(Number(data.copiesSold)) &&
      !Number.isNaN(Number(data.gameGenreId))
    ) {
      res = await window.api.addGame({
        title: data.title,
        description: data.description,
        developerName: data.developerName,
        rating: Number(data.rating),
        price: Number(data.price),
        copiesSold: Number(data.copiesSold),
        gameGenreId: Number(data.gameGenreId),
        relDate: USADateToUnix(data.relDate),
        image: uInt8ArrayImage,
      });
    } else {
      res = null;
    }

    if (res) {
      toaster.create({
        description: 'Игра успешно добавлена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Игра не добавлена',
        type: 'error',
      });
    }

    reset();
    setImageSrc(null);
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
          alt="image"
        />
      );

    if (field === 'relDate')
      return (
        <Input
          type="date"
          {...register(field as TGameForm, { required: true })}
          {...{
            variant: 'subtle',
            css: { width: 250 },
          }}
        />
      );

    if (field === 'gameGenreId')
      return (
        <select
          {...register(field as TGameForm, { required: true })}
          style={{
            width: 250,
            background: '#18181b',
            borderRadius: '4px',
            padding: 6,
          }}
        >
          {genreOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '70px' }}
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
                  title: 'Картинки нет',
                  description: 'Выберите картинку для игры',
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
