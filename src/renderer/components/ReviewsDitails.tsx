import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button, Textarea } from '@chakra-ui/react';

import { toaster } from './ui/toaster';
import { IReview, TReview } from '../types/review';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { IProduct } from '../types/product';
import a from '../../renderer/axios';

interface ReviewDitailsProps {
  reviewId: number;
  getReviewsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор отзыва', val: 'id' },
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Текст комментария', val: 'text_comment' },
  { lab: 'Идентификатор продукта', val: 'product' },
  { lab: 'Идентификатор покупателя', val: 'consumer' },
];

export const ReviewDitails: FC<ReviewDitailsProps> = ({
  reviewId,
  getReviewsAndWriteToState,
}) => {
  const [review, setReview] = useState<null | IReview>(null);
  const [isEdited, setIsEdited] = useState(false);
  const { register, handleSubmit, reset } = useForm<IReview>({
    values: {
      ...review,
    } as IReview,
  });

  const getReview = async () => {
    try {
      const res = await a.get<IReview>(`/review/?id=${reviewId}`);
      const resData = res.data;
      setReview(resData);
    } catch (e) {
      console.error(e);
    }
  };

  const onCancel = async () => {
    await reset();
    getReview();
    getReviewsAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IReview> = async (data) => {
    let resData: null | IReview = null;

    if (
      Number.isNaN(Number(data.product)) &&
      Number.isNaN(Number(data.consumer))
    ) {
      toaster.create({
        description: 'Отзыв не был обновлён',
        type: 'error',
      });
      return;
    }

    try {
      let res = await a.put<IReview>(`/review/?id=${data.id}`, {
        rating: data.rating,
        text_comment: data.text_comment,
        product: Number(data.product),
        consumer: Number(data.consumer),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Отзыв успешно обновлён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Отзыв не был обновлён',
        type: 'error',
      });
    }
    onCancel();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'text_comment')
      return (
        <Textarea
          {...register(field, { required: true })}
          {...{
            variant: 'subtle',
            disabled: !isEdited,
            css: {
              width: 250,
              height: 250,
              ...scrollBarStyles,
            },
          }}
        />
      );
    return (
      <Input
        {...register(field as TReview)}
        {...{
          variant: 'subtle',
          disabled: !isEdited || field === 'id',
          css: { width: 250 },
        }}
      />
    );
  };

  useEffect(() => {
    getReview();
  }, [reviewId]);

  if (review)
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
