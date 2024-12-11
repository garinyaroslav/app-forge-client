import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Flex,
  Image,
  Skeleton,
  Input,
  Text,
  Heading,
  Textarea,
  Button,
  Box,
} from '@chakra-ui/react';
import { IGame } from '../types/game';
import { IGameForm, TGameForm } from '../types/gameForm';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { toaster } from './ui/toaster';
import { unixToUSATime } from '../../utils/unixToUSADate';
import { USADateToUnix } from '../../utils/USADateToUnix';
import { IGenre } from '../types/genre';

interface GameDitaildProps {
  gameId: number;
  getGamesAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор игры', val: 'id' },
  { lab: 'Название игры', val: 'title' },
  { lab: 'Описание игры', val: 'description' },
  { lab: 'Разработчик', val: 'developerName' },
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Цена', val: 'price' },
  { lab: 'Продано копий', val: 'copiesSold' },
  { lab: 'Идентификатор жанра игры', val: 'gameGenreId' },
  { lab: 'Дата релиза', val: 'relDate' },
];

export const GameDitails: FC<GameDitaildProps> = ({
  gameId,
  getGamesAndWriteToState,
}) => {
  const [game, setGame] = useState<null | IGame>(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [defaultImageFileList, setDefaultImageFileList] =
    useState<null | FileList>(null);
  const [defaultDate, setDefaultDate] = useState<null | string>(null);
  const [genreOptions, setGenreOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { register, handleSubmit, reset } = useForm<IGameForm>({
    values: {
      ...game,
      image: defaultImageFileList,
      relDate: defaultDate,
    } as unknown as IGameForm,
  });

  const getGame = async () => {
    const data = await window.api.getGame(gameId).catch(console.error);

    const blob = new Blob([data[0].image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));

    const file = new File([blob], 'oldimage.png', {
      type: 'image/png',
    });
    const dt = new DataTransfer();
    dt.items.add(file);

    setDefaultImageFileList(dt.files);
    setDefaultDate(unixToUSATime(data[0].relDate));
    setGame(data[0]);
  };

  const getGenresAndWriteToState = async () => {
    const g = await window.api.getGenres().catch(console.error);

    setGenreOptions(
      g.map((genreObj: IGenre) => ({
        value: genreObj.id,
        label: genreObj.genreName,
      })),
    );
  };

  const onCancel = async () => {
    await reset();
    getGame();
    getGamesAndWriteToState();
    setIsEdited(false);
  };

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
      res = await window.api.updateGame({
        id: Number(data.id),
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
        description: 'Игра успешно обновлена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Игра не была обновлена',
        type: 'error',
      });
    }
    onCancel();
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
          {...register(field)}
          {...{
            disabled: !isEdited,
            variant: 'subtle',
            css: { width: 250, height: 300, ...scrollBarStyles },
          }}
        />
      );
    if (field === 'relDate')
      return (
        <Input
          type="date"
          {...register(field as TGameForm)}
          {...{
            variant: 'subtle',
            disabled: !isEdited,
            css: { width: 250 },
          }}
        />
      );
    if (field === 'gameGenreId')
      return (
        <select
          {...register(field as TGameForm, { required: true })}
          disabled={!isEdited}
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
    getGame();
    getGenresAndWriteToState();
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [gameId]);

  if (game)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '70px' }}
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
        </Flex>
        <Flex
          direction={'column'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
        >
          <Box>
            <Heading css={{ mb: 5 }}>Изображение игры</Heading>
            {imageSrc ? (
              <>
                <Image
                  css={{ height: 300, width: 350, mb: 5 }}
                  src={imageSrc}
                  alt="photo"
                />
                <input
                  hidden={!isEdited}
                  {...register('image')}
                  onChange={handleChangeFiles}
                  type="file"
                  accept="image/*"
                  alt="image"
                />
              </>
            ) : (
              <Skeleton css={{ height: 300, width: 350 }} />
            )}
          </Box>
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
