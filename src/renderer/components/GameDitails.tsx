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
import { excludedFields } from '../utils/excludedFields';
import { IGameForm, TGameForm } from '../types/gameForm';
import { scrollBarStyles } from '../utils/scrollBarStyles';
import { toaster } from './ui/toaster';
import { unixToUSATime } from '../utils/unixToUSADate';
import { USADateToUnix } from '../utils/USADateToUnix';

interface GameDitaildProps {
  gameId: number;
  getGamesAndWriteToState: () => void;
}

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
  const { register, handleSubmit, reset } = useForm<IGameForm>({
    values: {
      ...game,
      image: defaultImageFileList,
      relDate: defaultDate,
    } as unknown as IGameForm,
  });

  // console.log(defaultDate);

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

  const onCancel = async () => {
    await reset();
    getGame();
    getGamesAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IGameForm> = async (data) => {
    const arrayBuffer = await data.image.item(0)?.arrayBuffer();
    const uInt8ArrayImage = new Uint8Array(arrayBuffer as ArrayBuffer);

    const res = await window.api.updateGame({
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
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [gameId]);

  if (game)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '80px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {Object.keys(game)
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
