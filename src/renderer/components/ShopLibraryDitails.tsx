import { Box, Flex, Heading, Text, Image, Textarea } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { ILibGame } from '../types/game';
import { DataListItem, DataListRoot } from './ui/data-list';
import { Rating } from './ui/rating';
import { IReview } from '../types/review';
import { Button } from './ui/button';
import { toaster, Toaster } from './ui/toaster';

interface ShopLibraryDitailsProps {
  gameObj: ILibGame;
}

export const ShopLibraryDitails: FC<ShopLibraryDitailsProps> = ({
  gameObj,
}) => {
  const uid = localStorage.getItem('uid');
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [rating, setRating] = useState(0);
  const [textOfReview, setTextOfReview] = useState('');
  const [review, setReview] = useState<null | IReview>(null);

  const getCurReviewAndWrite = async () => {
    const res = (await window.api
      .getReviewByGameAndUserId(uid, gameObj.id)
      .catch(console.error)) as IReview[];

    if (res.length === 0) {
      setReview(null);
      setRating(0);
      setTextOfReview('');
    } else {
      setReview(res[0]);
      setRating(res[0].rating);
      setTextOfReview(res[0].textComment);
    }
  };

  const addReview = async () => {
    if (textOfReview.length > 0 && rating > 0) {
      const res = await window.api.addReview({
        rating,
        textComment: textOfReview,
        gameId: Number(gameObj.id),
        consumerId: Number(uid),
      });

      if (res) {
        toaster.create({
          description: 'Отзыв успешно добавлен',
          type: 'success',
        });
      } else {
        toaster.create({
          description: 'Отзыв не добавлен',
          type: 'error',
        });
      }

      await getCurReviewAndWrite();
    } else {
      toaster.create({
        description: 'Отзыв не добавлен: Заполните все поля',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    getCurReviewAndWrite();

    const blob = new Blob([gameObj.image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [gameObj]);

  return (
    <Flex
      css={{
        padding: '20px',
        gap: '80px',
        justifyContent: 'center',
      }}
    >
      <Toaster />
      <Flex width={500} direction={'column'} gap={5}>
        <Heading css={{ mb: 5 }}>{gameObj.title}</Heading>
        <Text css={{ fontSize: 18, fontWeight: 600 }}>Об игре</Text>
        <DataListRoot css={{ mb: 4 }} orientation={'horizontal'}>
          <DataListItem
            label={'Дата покупки'}
            value={new Date(gameObj.addedDate * 1000).toLocaleDateString()}
          />
          {review && (
            <>
              <DataListItem
                label={'Рейтинг'}
                value={
                  <Rating
                    readOnly
                    allowHalf
                    colorPalette="orange"
                    defaultValue={rating}
                    size="md"
                  />
                }
              />
              <DataListItem
                alignItems={'flex-start'}
                label={'Текст отзыва'}
                value={textOfReview}
              />
            </>
          )}
        </DataListRoot>
        {!review && (
          <>
            <Text css={{ fontSize: 18, fontWeight: 600 }}>Оставить отзыв</Text>
            <Flex css={{ alignItems: 'center', mb: 3 }}>
              <Text css={{ fontWeight: 500, mr: 6 }}>
                На сколько оцените игру?
              </Text>
              <Rating
                readOnly={false}
                allowHalf
                onValueChange={(e: { value: number }) => setRating(e.value)}
                colorPalette="orange"
                value={rating}
                size="md"
              />
            </Flex>
            <Textarea
              value={textOfReview}
              onChange={(e) => setTextOfReview(e.target.value)}
              variant={'subtle'}
              placeholder={'Текст отзыва'}
              css={{ h: 200 }}
            />
            <Button onClick={() => addReview()}>Оставить отзыв</Button>
          </>
        )}
      </Flex>
      <Box>
        <Heading css={{ mb: 5 }}>Изображение игры</Heading>
        {imageSrc ? (
          <Image
            css={{ height: 400, width: 400, borderRadius: 4 }}
            src={imageSrc}
            alt="photo"
          />
        ) : (
          <Skeleton css={{ height: 400, width: 400 }} />
        )}
      </Box>
    </Flex>
  );
};
