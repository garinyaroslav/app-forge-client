import { Box, Flex, Heading, Text, Image, Textarea } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { ILibProduct } from '../types/product';
import { DataListItem, DataListRoot } from './ui/data-list';
import { Rating } from './ui/rating';
import { IReview } from '../types/review';
import { Button } from './ui/button';
import { toaster, Toaster } from './ui/toaster';
import a from '../axios';
import { base64ToBlob } from '../../utils/base64ToBlob';
import { unixToUSATime } from '../../utils/unixToUSADate';

interface ShopLibraryDitailsProps {
  productObj: ILibProduct;
}

export const ShopLibraryDitails: FC<ShopLibraryDitailsProps> = ({
  productObj,
}) => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [rating, setRating] = useState(0);
  const [textOfReview, setTextOfReview] = useState('');
  const [review, setReview] = useState<null | IReview>(null);

  const getCurReviewAndWrite = async () => {
    try {
      const res = await a.get<IReview[]>('/software/review/', {
        params: { product_id: productObj.id },
      });
      const resData = res.data;

      if (resData.length === 0) {
        setReview(null);
        setRating(0);
        setTextOfReview('');
      } else {
        setReview(resData[0]);
        setRating(resData[0].rating);
        setTextOfReview(resData[0].text_comment);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addReview = async () => {
    if (textOfReview.length > 0 && rating > 0) {
      try {
        const res = await a.post('/software/review/', {
          rating,
          text_comment: textOfReview,
          product: Number(productObj.id),
        });

        if (res.status === 201) {
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
      } catch (e) {
        console.log(e);
      }
    } else {
      toaster.create({
        description: 'Отзыв не добавлен: Заполните все поля',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    getCurReviewAndWrite();

    const blob = base64ToBlob(productObj.image, 'image/png');
    setImageSrc(URL.createObjectURL(blob));
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [productObj]);

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
        <Heading css={{ mb: 5 }}>{productObj.title}</Heading>
        <Text css={{ fontSize: 18, fontWeight: 600 }}>Об игре</Text>
        <DataListRoot css={{ mb: 4 }} orientation={'horizontal'}>
          <DataListItem
            label={'Дата покупки'}
            value={unixToUSATime(productObj.added_date)}
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
                На сколько оцените приложение?
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
        <Heading css={{ mb: 5 }}>Изображение приложения</Heading>
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
