import { FC, useEffect, useState } from 'react';
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

interface GameDitaildProps {
  gameId: number;
}

export const GameDitails: FC<GameDitaildProps> = ({ gameId }) => {
  const [game, setGame] = useState<null | IGame>(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [isEdited, setIsEdited] = useState(false);
  const { register, handleSubmit } = useForm<IGameForm>({
    values: game as unknown as IGameForm,
  });

  const onSubmit: SubmitHandler<IGameForm> = (data) => console.log(data);

  useEffect(() => {
    (async () => {
      const data = await window.api.getGame(gameId).catch(console.error);
      const blob = new Blob([data[0].image], {
        type: 'image/png',
      });
      setGame(data[0]);
      setImageSrc(URL.createObjectURL(blob));
    })();
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [gameId]);

  return game ? (
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
              {field === 'description' ? (
                <Textarea
                  {...register(field)}
                  {...{
                    disabled: !isEdited,
                    variant: 'subtle',
                    css: { width: 250, height: 300, ...scrollBarStyles },
                  }}
                />
              ) : (
                <Input
                  {...register(field as TGameForm)}
                  {...{
                    variant: 'subtle',
                    disabled: !isEdited,
                    css: { width: 250 },
                  }}
                />
              )}
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
            <Image
              css={{ height: 300, width: 350 }}
              src={imageSrc}
              alt="photo"
            />
          ) : (
            <Skeleton css={{ height: 300, width: 350 }} />
          )}
        </Box>
        <Button css={{ width: 200 }}>{isEdited ? 'Готово' : 'Изменить'}</Button>
      </Flex>
    </form>
  ) : null;
};
